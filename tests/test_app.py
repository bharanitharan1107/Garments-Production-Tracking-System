import unittest

import app as application


class FlaskAppTests(unittest.TestCase):
    def setUp(self):
        application.app.config.update(TESTING=True)
        self.client = application.app.test_client()
        self.original_orders = [order.copy() for order in application.ORDERS]

    def tearDown(self):
        application.ORDERS[:] = self.original_orders

    def sign_in(self, email="admin@akashgarments.com", password="admin123"):
        return self.client.post(
            "/login",
            data={"email": email, "password": password},
            follow_redirects=True,
        )

    def test_dashboard_requires_login(self):
        response = self.client.get("/dashboard")

        self.assertEqual(response.status_code, 302)
        self.assertIn("/login", response.headers["Location"])

    def test_admin_can_open_all_sections(self):
        self.sign_in()
        paths = (
            "/dashboard",
            "/orders",
            "/inventory",
            "/production",
            "/quality-control",
            "/machines",
            "/shipping",
            "/workers",
            "/reports",
            "/users",
        )

        for path in paths:
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path).status_code, 200)

    def test_invalid_login_is_rejected(self):
        response = self.sign_in("nobody@example.com", "wrong-password")

        self.assertIn(b"not recognized", response.data)
        self.assertEqual(self.client.get("/orders").status_code, 302)

    def test_worker_role_is_limited_to_allowed_sections(self):
        self.sign_in("jwilson@akashgarments.com", "james123")

        self.assertEqual(self.client.get("/orders").status_code, 200)
        self.assertEqual(self.client.get("/inventory").status_code, 302)
        self.assertEqual(self.client.get("/dashboard").status_code, 302)

    def test_order_filter_create_and_delete(self):
        self.sign_in()
        filtered = self.client.get("/orders?q=ORD-2026-001")
        self.assertIn(b"ORD-2026-001", filtered.data)
        self.assertNotIn(b"ORD-2026-002", filtered.data)

        self.client.post(
            "/orders",
            data={
                "action": "create",
                "customer": "Test Customer",
                "product": "Test Shirt",
                "quantity": "10",
                "unit_price": "12",
            },
        )
        created = next(order for order in application.ORDERS if order["customer"] == "Test Customer")
        self.assertEqual(created["value"], 120)

        self.client.post("/orders", data={"action": "delete", "id": created["id"]})
        self.assertNotIn(created, application.ORDERS)


if __name__ == "__main__":
    unittest.main()