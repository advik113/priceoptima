import sys
import unittest
from unittest.mock import MagicMock

# 1. Mock pymysql before config.py is imported to allow isolated testing without MySQL credentials
mock_conn = MagicMock()
mock_cursor = MagicMock()
mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
mock_pymysql = MagicMock()
mock_pymysql.connect.return_value = mock_conn
sys.modules["pymysql"] = mock_pymysql

# 2. Mock get_database_uri before Config class loads
import config
config.get_database_uri = lambda: "sqlite:///:memory:"
config.Config.SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"

# 3. Import app and models
from app import app, db
from database.db import User

class TestPhase2AuthAPI(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        self.app = app
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_01_register_json_success(self):
        """Verify React frontend JSON registration sets session and returns user."""
        res = self.client.post("/register", json={
            "full_name": "Elena Rostova",
            "email": "elena@enterprise.com",
            "password": "SecurePassword123!",
            "confirm_password": "SecurePassword123!"
        })
        self.assertEqual(res.status_code, 201)
        data = res.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(data["user"]["username"], "Elena Rostova")
        self.assertEqual(data["user"]["email"], "elena@enterprise.com")

        # Verify password is encrypted in database
        user = User.query.filter_by(email="elena@enterprise.com").first()
        self.assertIsNotNone(user)
        self.assertNotEqual(user.password_hash, "SecurePassword123!")
        self.assertTrue(user.check_password("SecurePassword123!"))
        print("\n[TEST PASS] JSON Registration & password hashing verified.")

    def test_02_register_validation_failures(self):
        """Verify validation errors return 400 with descriptive messages."""
        # Short password
        res = self.client.post("/register", json={
            "full_name": "Short Pass User",
            "email": "short@test.com",
            "password": "123",
            "confirm_password": "123"
        })
        self.assertEqual(res.status_code, 400)
        self.assertIn("at least 6 characters", res.get_json()["message"])

        # Password mismatch
        res2 = self.client.post("/register", json={
            "full_name": "Mismatch User",
            "email": "mismatch@test.com",
            "password": "Password123",
            "confirm_password": "DifferentPassword456"
        })
        self.assertEqual(res2.status_code, 400)
        self.assertIn("do not match", res2.get_json()["message"])
        print("[TEST PASS] Registration field validation & error handling verified.")

    def test_03_login_json_and_session_persistence(self):
        """Verify login sets session and /api/auth/status confirms persistence."""
        # Create user
        u = User(username="Marcus Vance", email="marcus@pricing.ai")
        u.set_password("AlphaRetail2026!")
        db.session.add(u)
        db.session.commit()

        # 1. Invalid login
        bad_res = self.client.post("/login", json={
            "email": "marcus@pricing.ai",
            "password": "WrongPassword!"
        })
        self.assertEqual(bad_res.status_code, 401)

        # 2. Valid login by email
        good_res = self.client.post("/login", json={
            "email": "marcus@pricing.ai",
            "password": "AlphaRetail2026!"
        })
        self.assertEqual(good_res.status_code, 200)
        data = good_res.get_json()
        self.assertTrue(data["success"])
        self.assertEqual(data["user"]["username"], "Marcus Vance")

        # 3. Check session status endpoint with active cookie
        status_res = self.client.get("/api/auth/status")
        self.assertEqual(status_res.status_code, 200)
        status_data = status_res.get_json()
        self.assertTrue(status_data["authenticated"])
        self.assertEqual(status_data["user"]["username"], "Marcus Vance")

        # 4. Logout
        logout_res = self.client.post("/logout")
        self.assertEqual(logout_res.status_code, 200)

        # 5. Check session status after logout
        post_logout_status = self.client.get("/api/auth/status")
        self.assertFalse(post_logout_status.get_json()["authenticated"])
        print("[TEST PASS] JSON Login, session cookie persistence, and logout verified.")

    def test_04_backward_compatibility_form_post(self):
        """Ensure original HTML form POSTs continue working without regression."""
        # Form register
        form_res = self.client.post("/register", data={
            "username": "legacy_form_user",
            "email": "legacy@form.com",
            "password": "LegacyPassword123",
            "confirm_password": "LegacyPassword123"
        }, follow_redirects=False)
        self.assertEqual(form_res.status_code, 302)  # Redirects to index

        # Form login
        self.client.get("/logout")
        login_res = self.client.post("/login", data={
            "username": "legacy_form_user",
            "password": "LegacyPassword123"
        }, follow_redirects=False)
        self.assertEqual(login_res.status_code, 302)  # Redirects to index
        print("[TEST PASS] Backwards-compatible HTML Form submission verified.")


if __name__ == "__main__":
    unittest.main()
