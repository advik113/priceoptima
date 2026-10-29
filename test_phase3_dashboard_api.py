import sys
import unittest
from unittest.mock import MagicMock

# Mock pymysql before config.py is imported to allow isolated testing without MySQL daemon
mock_conn = MagicMock()
mock_cursor = MagicMock()
mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
mock_pymysql = MagicMock()
mock_pymysql.connect.return_value = mock_conn
sys.modules["pymysql"] = mock_pymysql

import config
config.get_database_uri = lambda: "sqlite:///:memory:"
config.Config.SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"

from app import app, db
from database.db import User, Product, Sale, MarketData, PriceRecommendation

class TestPhase3DashboardAPIs(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        self.app = app
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

        # Seed User A
        self.user_a = User(username="MerchantA", email="usera@merchants.com")
        self.user_a.set_password("SecretPass123!")
        db.session.add(self.user_a)

        # Seed User B
        self.user_b = User(username="MerchantB", email="userb@merchants.com")
        self.user_b.set_password("SecretPass456!")
        db.session.add(self.user_b)
        db.session.commit()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def login_as(self, email, password):
        return self.client.post("/login", json={"email": email.lower(), "password": password})

    def test_01_unauthenticated_api_protection(self):
        """Unauthenticated requests to all /api/ endpoints must return 401."""
        res1 = self.client.get("/api/dashboard/overview")
        self.assertEqual(res1.status_code, 401)
        res2 = self.client.get("/api/products")
        self.assertEqual(res2.status_code, 401)
        res3 = self.client.get("/api/sales")
        self.assertEqual(res3.status_code, 401)
        res4 = self.client.get("/api/market")
        self.assertEqual(res4.status_code, 401)
        res5 = self.client.get("/api/pricing/data")
        self.assertEqual(res5.status_code, 401)
        print("\n[TEST PASS] Unauthenticated API protection (401 Unauthorized) verified.")

    def test_02_products_crud_and_multi_tenant_isolation(self):
        """Verify product CRUD and verify User B cannot edit or delete User A's SKU."""
        self.login_as("userA@merchants.com", "SecretPass123!")

        # 1. User A adds a product
        add_res = self.client.post("/api/products/add", json={
            "name": "Noise Cancelling Headset",
            "category": "Audio",
            "cost_price": 50.0,
            "base_price": 120.0,
            "current_price": 120.0,
            "competitor_price": 125.0,
            "inventory_level": 40,
            "demand_level": 3,
            "season": 4
        })
        self.assertEqual(add_res.status_code, 201)
        prod_a_id = add_res.get_json()["product"]["id"]

        # 2. User A edits product
        edit_res = self.client.post(f"/api/products/edit/{prod_a_id}", json={
            "name": "Noise Cancelling Headset Pro",
            "category": "Audio",
            "cost_price": 55.0,
            "base_price": 130.0,
            "current_price": 130.0
        })
        self.assertEqual(edit_res.status_code, 200)
        self.assertEqual(edit_res.get_json()["product"]["name"], "Noise Cancelling Headset Pro")

        # 3. User B logs in and attempts to edit/delete User A's product
        self.client.post("/logout")
        self.login_as("userB@merchants.com", "SecretPass456!")

        unauth_edit = self.client.post(f"/api/products/edit/{prod_a_id}", json={
            "name": "Hacked Product Name"
        })
        self.assertEqual(unauth_edit.status_code, 404)

        unauth_del = self.client.post(f"/api/products/delete/{prod_a_id}")
        self.assertEqual(unauth_del.status_code, 404)

        # User B's product list must be empty
        b_prods = self.client.get("/api/products").get_json()["products"]
        self.assertEqual(len(b_prods), 0)
        print("[TEST PASS] Product CRUD & Strict Multi-Tenant Data Isolation verified.")

    def test_03_sales_logging_and_inventory_decrement(self):
        """Verify logging a sale adds to sales log and decrements warehouse inventory."""
        self.login_as("userA@merchants.com", "SecretPass123!")

        # Add product with 50 units
        p_res = self.client.post("/api/products/add", json={
            "name": "Ergonomic Desk",
            "category": "Furniture",
            "cost_price": 100.0,
            "base_price": 250.0,
            "current_price": 250.0,
            "inventory_level": 50
        })
        pid = p_res.get_json()["product"]["id"]

        # Log sale of 5 units
        sale_res = self.client.post("/api/sales/add", json={
            "product_id": pid,
            "quantity_sold": 5,
            "selling_price": 250.0,
            "sale_date": "2026-10-29"
        })
        self.assertEqual(sale_res.status_code, 201)
        self.assertEqual(sale_res.get_json()["sale"]["total_revenue"], 1250.0)

        # Check market data inventory decremented to 45
        m_entry = MarketData.query.filter_by(product_id=pid).first()
        self.assertEqual(m_entry.inventory_level, 45)
        print("[TEST PASS] Sales logging & automatic inventory decrement verified.")

    def test_04_ml_pricing_recommendation_and_apply(self):
        """Verify running ML prediction on product and applying recommendation to catalog."""
        self.login_as("userA@merchants.com", "SecretPass123!")

        p_res = self.client.post("/api/products/add", json={
            "name": "Smart Thermostat",
            "category": "Electronics",
            "cost_price": 40.0,
            "base_price": 100.0,
            "current_price": 100.0,
            "competitor_price": 110.0,
            "inventory_level": 25,
            "demand_level": 3,
            "season": 4
        })
        pid = p_res.get_json()["product"]["id"]

        # 1. Trigger ML recommendation
        rec_res = self.client.post(f"/api/pricing/recommend/{pid}", json={
            "competitor_price": 115.0,
            "demand_level": 3,
            "inventory_level": 20,
            "season": 4
        })
        self.assertEqual(rec_res.status_code, 200)
        rec_data = rec_res.get_json()["recommendation"]
        self.assertGreater(rec_data["recommended_price"], 0)
        self.assertEqual(rec_data["status"], "Pending")
        rec_id = rec_data["id"]

        # 2. Apply recommendation
        apply_res = self.client.post(f"/api/pricing/apply/{rec_id}")
        self.assertEqual(apply_res.status_code, 200)
        applied_prod = apply_res.get_json()["product"]
        self.assertEqual(applied_prod["current_price"], rec_data["recommended_price"])

        # Confirm status is now Applied
        db_rec = PriceRecommendation.query.get(rec_id)
        self.assertEqual(db_rec.status, "Applied")
        print("[TEST PASS] Real ML inference generation and 1-click price application verified.")

    def test_05_overview_and_analytics_summary(self):
        """Verify dashboard overview KPIs and reports summary calculations."""
        self.login_as("userA@merchants.com", "SecretPass123!")

        # Load demo data
        demo_res = self.client.post("/api/user/load-demo-data")
        self.assertEqual(demo_res.status_code, 200)

        overview_res = self.client.get("/api/dashboard/overview")
        self.assertEqual(overview_res.status_code, 200)
        kpis = overview_res.get_json()["kpis"]
        self.assertGreaterEqual(kpis["total_products"], 4)

        reports_res = self.client.get("/api/reports/summary")
        self.assertEqual(reports_res.status_code, 200)
        self.assertIn("profit_margin", reports_res.get_json())
        print("[TEST PASS] Dashboard overview KPIs & reports analytics verified.")

if __name__ == "__main__":
    unittest.main()
