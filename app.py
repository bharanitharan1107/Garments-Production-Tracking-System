import os
from datetime import date
from functools import wraps

from flask import Flask, flash, redirect, render_template, request, session, url_for

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "local-development-key-change-me")

USERS = [
    {"id": "u1", "name": "Admin User", "email": "admin@akashgarments.com", "password": "admin123", "role": "Admin", "department": "Management", "avatar": "AU"},
    {"id": "u2", "name": "Sarah Johnson", "email": "sarah@akashgarments.com", "password": "sarah123", "role": "Admin", "department": "Management", "avatar": "SJ"},
    {"id": "u3", "name": "Michael Chen", "email": "mchen@akashgarments.com", "password": "mike123", "role": "Production Manager", "department": "Production", "avatar": "MC"},
    {"id": "u4", "name": "Priya Patel", "email": "priya@akashgarments.com", "password": "priya123", "role": "Production Manager", "department": "Production", "avatar": "PP"},
    {"id": "u5", "name": "James Wilson", "email": "jwilson@akashgarments.com", "password": "james123", "role": "Worker", "department": "Sewing", "avatar": "JW"},
    {"id": "u6", "name": "Fatima Al-Hassan", "email": "fatima@akashgarments.com", "password": "fatima123", "role": "Worker", "department": "Cutting", "avatar": "FH"},
    {"id": "u7", "name": "David Park", "email": "dpark@akashgarments.com", "password": "david123", "role": "QC Inspector", "department": "Quality Control", "avatar": "DP"},
    {"id": "u8", "name": "Lisa Torres", "email": "ltorres@akashgarments.com", "password": "lisa123", "role": "QC Inspector", "department": "Quality Control", "avatar": "LT"},
]

ORDERS = [
    {"id": "o1", "number": "ORD-2026-001", "customer": "Lakshmi Silks & Fashions", "product": "Classic White T-Shirt", "quantity": 5000, "status": "In Progress", "priority": "High", "deadline": "2026-03-20", "assigned": "Michael Chen", "value": 925000},
    {"id": "o2", "number": "ORD-2026-002", "customer": "Coimbatore Textile Hub", "product": "Slim Fit Jeans", "quantity": 3000, "status": "QC Review", "priority": "Medium", "deadline": "2026-03-25", "assigned": "Priya Patel", "value": 1650000},
    {"id": "o3", "number": "ORD-2026-003", "customer": "Salem Garment Exports", "product": "Floral Summer Dress", "quantity": 2500, "status": "Pending", "priority": "Medium", "deadline": "2026-04-05", "assigned": "Michael Chen", "value": 1875000},
    {"id": "o4", "number": "ORD-2026-004", "customer": "Madurai Fashion Corner", "product": "Men's Polo Shirt", "quantity": 4000, "status": "In Progress", "priority": "Critical", "deadline": "2026-03-18", "assigned": "Priya Patel", "value": 1280000},
    {"id": "o5", "number": "ORD-2026-005", "customer": "Tirupur Export House", "product": "Athletic Hoodie", "quantity": 6000, "status": "Completed", "priority": "High", "deadline": "2026-03-10", "assigned": "Michael Chen", "value": 5100000},
    {"id": "o6", "number": "ORD-2026-006", "customer": "Bangalore Knits Pvt Ltd", "product": "Women's Blazer", "quantity": 1500, "status": "In Progress", "priority": "Low", "deadline": "2026-04-10", "assigned": "Priya Patel", "value": 2700000},
    {"id": "o7", "number": "ORD-2026-007", "customer": "Chennai Garment Mall", "product": "Kurta Set", "quantity": 8000, "status": "In Progress", "priority": "High", "deadline": "2026-03-28", "assigned": "Michael Chen", "value": 3600000},
    {"id": "o8", "number": "ORD-2026-008", "customer": "Erode Silk Sarees Co", "product": "Evening Gown", "quantity": 500, "status": "Pending", "priority": "High", "deadline": "2026-04-20", "assigned": "Priya Patel", "value": 2250000},
    {"id": "o9", "number": "ORD-2026-009", "customer": "Lakshmi Silks & Fashions", "product": "Cargo Shorts", "quantity": 3500, "status": "Cancelled", "priority": "Low", "deadline": "2026-03-15", "assigned": "Michael Chen", "value": 980000},
    {"id": "o10", "number": "ORD-2026-010", "customer": "Coimbatore Textile Hub", "product": "Denim Jacket", "quantity": 2000, "status": "On Hold", "priority": "Medium", "deadline": "2026-04-01", "assigned": "Priya Patel", "value": 2400000},
    {"id": "o11", "number": "ORD-2026-011", "customer": "Salem Garment Exports", "product": "Chiffon Blouse", "quantity": 4000, "status": "In Progress", "priority": "High", "deadline": "2026-03-22", "assigned": "Michael Chen", "value": 1520000},
    {"id": "o12", "number": "ORD-2026-012", "customer": "Tirupur Export House", "product": "Track Pants", "quantity": 5000, "status": "QC Review", "priority": "Medium", "deadline": "2026-03-30", "assigned": "Priya Patel", "value": 2600000},
]

INVENTORY = [
    {"name": "White Cotton Fabric", "category": "Fabric", "sku": "FAB-COT-001", "quantity": "5,000 m", "minimum": "2,000 m", "location": "Warehouse A · Shelf 1", "supplier": "Chennai Textiles Pvt Ltd", "status": "In Stock"},
    {"name": "Blue Denim Fabric", "category": "Fabric", "sku": "FAB-DEN-002", "quantity": "1,800 m", "minimum": "2,000 m", "location": "Warehouse A · Shelf 3", "supplier": "Coimbatore Denim Mills", "status": "Low Stock"},
    {"name": "Black Polyester Thread", "category": "Thread", "sku": "THR-POL-001", "quantity": "800 spools", "minimum": "500 spools", "location": "Supply Room B", "supplier": "Tirupur Thread Works", "status": "In Stock"},
    {"name": "White Polyester Thread", "category": "Thread", "sku": "THR-POL-002", "quantity": "350 spools", "minimum": "500 spools", "location": "Supply Room B", "supplier": "Tirupur Thread Works", "status": "Low Stock"},
    {"name": "Plastic Buttons (12mm)", "category": "Accessories", "sku": "ACC-BTN-001", "quantity": "50,000 pcs", "minimum": "10,000 pcs", "location": "Storage C · Bin 4", "supplier": "Salem Button Industries", "status": "In Stock"},
    {"name": "Metal Zippers (20cm)", "category": "Accessories", "sku": "ACC-ZIP-001", "quantity": "3,000 pcs", "minimum": "2,000 pcs", "location": "Storage C · Bin 7", "supplier": "Erode Zipper Co", "status": "In Stock"},
    {"name": "Floral Print Chiffon", "category": "Fabric", "sku": "FAB-CHF-003", "quantity": "2,200 m", "minimum": "1,500 m", "location": "Warehouse A · Shelf 5", "supplier": "Kanchipuram Silks", "status": "In Stock"},
    {"name": "Elastic Band (2.5cm)", "category": "Accessories", "sku": "ACC-ELB-001", "quantity": "450 m", "minimum": "500 m", "location": "Storage C · Bin 2", "supplier": "Madurai Elastics", "status": "Low Stock"},
    {"name": "Silk Fabric (Premium)", "category": "Fabric", "sku": "FAB-SLK-004", "quantity": "800 m", "minimum": "500 m", "location": "Warehouse A · Shelf 8", "supplier": "Kanchipuram Silks", "status": "In Stock"},
]

PRODUCTION = [
    {"order": "ORD-2026-001", "product": "Classic White T-Shirt", "stage": "Sewing", "progress": "65%", "completed": "3,250 / 5,000", "status": "Active", "deadline": "2026-03-20", "team": "3 workers"},
    {"order": "ORD-2026-002", "product": "Slim Fit Jeans", "stage": "QC", "progress": "90%", "completed": "2,700 / 3,000", "status": "Active", "deadline": "2026-03-25", "team": "2 workers"},
    {"order": "ORD-2026-004", "product": "Men's Polo Shirt", "stage": "Finishing", "progress": "78%", "completed": "3,120 / 4,000", "status": "Delayed", "deadline": "2026-03-18", "team": "3 workers"},
    {"order": "ORD-2026-005", "product": "Athletic Hoodie", "stage": "Packaging", "progress": "100%", "completed": "6,000 / 6,000", "status": "Completed", "deadline": "2026-03-10", "team": "2 workers"},
    {"order": "ORD-2026-007", "product": "Kurta Set", "stage": "Cutting", "progress": "35%", "completed": "2,800 / 8,000", "status": "Active", "deadline": "2026-03-28", "team": "4 workers"},
    {"order": "ORD-2026-006", "product": "Women's Blazer", "stage": "Sewing", "progress": "42%", "completed": "630 / 1,500", "status": "Active", "deadline": "2026-04-10", "team": "2 workers"},
    {"order": "ORD-2026-011", "product": "Chiffon Blouse", "stage": "Sewing", "progress": "58%", "completed": "2,320 / 4,000", "status": "Delayed", "deadline": "2026-03-22", "team": "2 workers"},
    {"order": "ORD-2026-012", "product": "Track Pants", "stage": "QC", "progress": "88%", "completed": "4,400 / 5,000", "status": "Active", "deadline": "2026-03-30", "team": "2 workers"},
]

WORKERS = [
    {"employee": "EMP-001", "name": "Karthik Rajan", "department": "Sewing", "role": "Senior Tailor", "shift": "Morning", "status": "On Duty", "efficiency": "94%", "tasks": 342},
    {"employee": "EMP-002", "name": "Priya Devi", "department": "Sewing", "role": "Tailor", "shift": "Morning", "status": "On Duty", "efficiency": "88%", "tasks": 287},
    {"employee": "EMP-003", "name": "Mohan Sundaram", "department": "Sewing", "role": "Tailor", "shift": "Afternoon", "status": "On Duty", "efficiency": "91%", "tasks": 315},
    {"employee": "EMP-004", "name": "Lakshmi Narayan", "department": "Cutting", "role": "Cutter", "shift": "Morning", "status": "On Duty", "efficiency": "96%", "tasks": 401},
    {"employee": "EMP-005", "name": "Senthil Kumar", "department": "Cutting", "role": "Cutter", "shift": "Morning", "status": "On Duty", "efficiency": "85%", "tasks": 256},
    {"employee": "EMP-006", "name": "Anitha Rani", "department": "Finishing", "role": "Finisher", "shift": "Afternoon", "status": "On Duty", "efficiency": "89%", "tasks": 298},
    {"employee": "EMP-007", "name": "Rajesh Menon", "department": "Finishing", "role": "Finisher", "shift": "Night", "status": "Off Duty", "efficiency": "92%", "tasks": 334},
    {"employee": "EMP-008", "name": "Deepa Krishnan", "department": "Embroidery", "role": "Embroiderer", "shift": "Morning", "status": "On Duty", "efficiency": "97%", "tasks": 445},
]

QUALITY = [
    {"order": "ORD-2026-002", "product": "Slim Fit Jeans", "inspector": "David Park", "date": "2026-03-09", "status": "Passed", "inspected": 500, "defects": 12, "issue": "Minor Stitching", "severity": "Low"},
    {"order": "ORD-2026-004", "product": "Men's Polo Shirt", "inspector": "Lisa Torres", "date": "2026-03-08", "status": "Failed", "inspected": 300, "defects": 45, "issue": "Logo Alignment", "severity": "High"},
    {"order": "ORD-2026-005", "product": "Athletic Hoodie", "inspector": "David Park", "date": "2026-03-09", "status": "Passed", "inspected": 1000, "defects": 8, "issue": "Color Variation", "severity": "Low"},
    {"order": "ORD-2026-001", "product": "Classic White T-Shirt", "inspector": "Lisa Torres", "date": "2026-03-07", "status": "Under Review", "inspected": 400, "defects": 28, "issue": "Fabric Pilling", "severity": "Medium"},
    {"order": "ORD-2026-012", "product": "Track Pants", "inspector": "David Park", "date": "2026-03-10", "status": "Rework Required", "inspected": 600, "defects": 72, "issue": "Elastic Defect", "severity": "High"},
    {"order": "ORD-2026-007", "product": "Kurta Set", "inspector": "Lisa Torres", "date": "2026-03-06", "status": "Passed", "inspected": 250, "defects": 5, "issue": "Minor Stitching", "severity": "Low"},
]

MACHINES = [
    {"name": "Industrial Sewing Machine A1", "type": "Sewing", "status": "Running", "efficiency": "92%", "hours": "4,280", "operator": "Ahmed Hassan", "location": "Hall A · Row 1", "maintenance": "2026-03-15"},
    {"name": "Industrial Sewing Machine A2", "type": "Sewing", "status": "Running", "efficiency": "88%", "hours": "3,950", "operator": "Maria Santos", "location": "Hall A · Row 2", "maintenance": "2026-03-20"},
    {"name": "Automated Cutting Machine C1", "type": "Cutting", "status": "Running", "efficiency": "97%", "hours": "2,100", "operator": "Yuki Tanaka", "location": "Hall B · Station 1", "maintenance": "2026-03-28"},
    {"name": "Overlock Machine O1", "type": "Overlock", "status": "Idle", "efficiency": "79%", "hours": "5,600", "operator": "Liu Wei", "location": "Hall A · Row 5", "maintenance": "2026-03-10"},
    {"name": "Embroidery Machine E1", "type": "Embroidery", "status": "Running", "efficiency": "94%", "hours": "1,890", "operator": "Elena Popescu", "location": "Hall C · Row 1", "maintenance": "2026-04-01"},
    {"name": "Heat Press Machine H1", "type": "Heat Press", "status": "Maintenance", "efficiency": "0%", "hours": "3,200", "operator": "Amara Diallo", "location": "Hall D · Station 2", "maintenance": "2026-04-09"},
    {"name": "Automated Cutting Machine C2", "type": "Cutting", "status": "Breakdown", "efficiency": "0%", "hours": "4,100", "operator": "Kenji Mori", "location": "Hall B · Station 3", "maintenance": "2026-02-20"},
]

SHIPMENTS = [
    {"order": "ORD-2026-005", "customer": "Tirupur Export House", "destination": "Tirupur, Tamil Nadu", "carrier": "Delhivery", "tracking": "DLV-78452319", "status": "In Transit", "weight": "420 kg", "delivery": "2026-03-14"},
    {"order": "ORD-2026-002", "customer": "Coimbatore Textile Hub", "destination": "Coimbatore, Tamil Nadu", "carrier": "Blue Dart", "tracking": "BD-12398745", "status": "Preparing", "weight": "180 kg", "delivery": "2026-03-28"},
    {"order": "ORD-2026-009", "customer": "Lakshmi Silks & Fashions", "destination": "Chennai, Tamil Nadu", "carrier": "DTDC", "tracking": "DT-45612378", "status": "Returned", "weight": "220 kg", "delivery": "2026-03-07"},
    {"order": "ORD-2026-003", "customer": "Salem Garment Exports", "destination": "Salem, Tamil Nadu", "carrier": "Professional Couriers", "tracking": "PC-99123456", "status": "Preparing", "weight": "145 kg", "delivery": "2026-04-05"},
    {"order": "ORD-2026-007", "customer": "Chennai Garment Mall", "destination": "Chennai, Tamil Nadu", "carrier": "Shadowfax", "tracking": "SF-78901234", "status": "Preparing", "weight": "380 kg", "delivery": "2026-03-30"},
]

PAGE_CONFIG = {
    "orders": {"title": "Order Management", "description": "Track customer orders from confirmation through completion.", "roles": None, "rows": ORDERS, "columns": [("number", "Order #"), ("customer", "Customer"), ("product", "Product"), ("quantity", "Quantity"), ("value", "Value"), ("status", "Status"), ("priority", "Priority"), ("deadline", "Deadline"), ("assigned", "Assigned")], "filters": ["status", "priority"]},
    "inventory": {"title": "Inventory", "description": "Materials, supplies, and current stock levels.", "roles": ["Admin", "Production Manager"], "rows": INVENTORY, "columns": [("name", "Item"), ("category", "Category"), ("sku", "SKU"), ("quantity", "On hand"), ("minimum", "Reorder point"), ("location", "Location"), ("supplier", "Supplier"), ("status", "Stock status")], "filters": ["category", "status"]},
    "production": {"title": "Production Tracking", "description": "Active work orders across the factory floor.", "roles": None, "rows": PRODUCTION, "columns": [("order", "Order #"), ("product", "Product"), ("stage", "Stage"), ("progress", "Progress"), ("completed", "Units completed"), ("status", "Status"), ("deadline", "Due date"), ("team", "Team")], "filters": ["stage", "status"]},
    "workers": {"title": "Workforce", "description": "Shift coverage, attendance, and worker performance.", "roles": ["Admin", "Production Manager"], "rows": WORKERS, "columns": [("employee", "Employee #"), ("name", "Name"), ("department", "Department"), ("role", "Role"), ("shift", "Shift"), ("status", "Attendance"), ("efficiency", "Efficiency"), ("tasks", "Tasks completed")], "filters": ["department", "shift", "status"]},
    "quality-control": {"title": "Quality Control", "description": "Inspection results, defects, and rework requiring attention.", "roles": ["Admin", "Production Manager", "QC Inspector"], "rows": QUALITY, "columns": [("order", "Order #"), ("product", "Product"), ("inspector", "Inspector"), ("date", "Date"), ("status", "Result"), ("inspected", "Inspected"), ("defects", "Defects"), ("issue", "Issue type"), ("severity", "Severity")], "filters": ["status", "severity"]},
    "machines": {"title": "Machine Operations", "description": "Equipment availability, utilization, and maintenance schedule.", "roles": ["Admin", "Production Manager"], "rows": MACHINES, "columns": [("name", "Machine"), ("type", "Type"), ("status", "Status"), ("efficiency", "Efficiency"), ("hours", "Operating hours"), ("operator", "Operator"), ("location", "Location"), ("maintenance", "Next maintenance")], "filters": ["type", "status"]},
    "shipping": {"title": "Shipping & Dispatch", "description": "Delivery status and carrier tracking for customer orders.", "roles": ["Admin", "Production Manager"], "rows": SHIPMENTS, "columns": [("order", "Order #"), ("customer", "Customer"), ("destination", "Destination"), ("carrier", "Carrier"), ("tracking", "Tracking #"), ("status", "Status"), ("weight", "Weight"), ("delivery", "Est. delivery")], "filters": ["status"]},
    "users": {"title": "User Management", "description": "Application accounts and access roles.", "roles": ["Admin"], "rows": USERS, "columns": [("name", "Name"), ("email", "Email"), ("role", "Role"), ("department", "Department"), ("id", "Account ID")], "filters": ["role"]},
}

NAV_ITEMS = [
    ("dashboard", "Dashboard", ["Admin", "Production Manager"]),
    ("orders", "Orders", ["Admin", "Production Manager", "Worker", "QC Inspector"]),
    ("inventory", "Inventory", ["Admin", "Production Manager"]),
    ("production", "Production", ["Admin", "Production Manager", "Worker"]),
    ("quality-control", "Quality Control", ["Admin", "Production Manager", "QC Inspector"]),
    ("shipping", "Shipping & Dispatch", ["Admin", "Production Manager"]),
    ("workers", "Workers", ["Admin", "Production Manager"]),
    ("machines", "Machines", ["Admin", "Production Manager"]),
    ("reports", "Reports & Analytics", ["Admin", "Production Manager"]),
    ("users", "User Management", ["Admin"]),
]


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        if "user" not in session:
            return redirect(url_for("login"))
        return view(*args, **kwargs)
    return wrapped


@app.context_processor
def inject_navigation():
    user = session.get("user")
    role = user.get("role") if user else None
    return {"current_user": user, "nav_items": [item for item in NAV_ITEMS if role in item[2]]}


@app.get("/")
def index():
    return redirect(url_for("dashboard" if "user" in session else "login"))


@app.route("/login", methods=["GET", "POST"])
def login():
    if "user" in session:
        return redirect(url_for("dashboard"))
    if request.method == "POST":
        email = request.form.get("email", "").strip().lower()
        password = request.form.get("password", "")
        user = next((item for item in USERS if item["email"].lower() == email and item["password"] == password), None)
        if user:
            session["user"] = {key: user[key] for key in ("id", "name", "email", "role", "department", "avatar")}
            session.permanent = request.form.get("remember") == "on"
            return redirect(url_for("dashboard"))
        flash("Email or password was not recognized.", "error")
    return render_template("login.html")


@app.post("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.get("/dashboard")
@login_required
def dashboard():
    if session["user"]["role"] not in ("Admin", "Production Manager"):
        return redirect(url_for("page", page="orders"))
    active_orders = [order for order in ORDERS if order["status"] in ("In Progress", "QC Review", "Pending")]
    metrics = [
        ("Open order value", f"₹{sum(order['value'] for order in active_orders):,}", "Across active orders"),
        ("Orders in progress", sum(order["status"] == "In Progress" for order in ORDERS), "Currently on the floor"),
        ("Workers on duty", sum(worker["status"] == "On Duty" for worker in WORKERS), "Across all departments"),
        ("Machines running", sum(machine["status"] == "Running" for machine in MACHINES), "Of {} tracked".format(len(MACHINES))),
    ]
    return render_template("dashboard.html", metrics=metrics, orders=ORDERS[:5], production=PRODUCTION[:5], low_stock=[item for item in INVENTORY if item["status"] == "Low Stock"])


@app.route("/<page>", methods=["GET", "POST"])
@login_required
def page(page):
    config = PAGE_CONFIG.get(page)
    if not config:
        return render_template("not_found.html"), 404
    if config["roles"] and session["user"]["role"] not in config["roles"]:
        flash("Your account does not have access to that section.", "error")
        return redirect(url_for("page", page="orders"))

    rows = config["rows"]
    if page == "orders" and request.method == "POST":
        action = request.form.get("action")
        if action == "delete":
            order_id = request.form.get("id")
            ORDERS[:] = [order for order in ORDERS if order["id"] != order_id]
            flash("Order removed.", "success")
        elif action == "create":
            customer = request.form.get("customer", "").strip()
            product = request.form.get("product", "").strip()
            try:
                quantity = int(request.form.get("quantity", "0"))
                unit_price = float(request.form.get("unit_price", "0"))
            except ValueError:
                quantity, unit_price = 0, 0
            if customer and product and quantity > 0:
                next_number = max((int(order["number"].split("-")[-1]) for order in ORDERS), default=0) + 1
                ORDERS.insert(0, {"id": f"o{next_number}", "number": f"ORD-2026-{next_number:03d}", "customer": customer, "product": product, "quantity": quantity, "status": "Pending", "priority": request.form.get("priority", "Medium"), "deadline": request.form.get("deadline", ""), "assigned": session["user"]["name"], "value": int(quantity * unit_price)})
                flash("Order created.", "success")
            else:
                flash("Enter a customer, product, and quantity greater than zero.", "error")
        return redirect(url_for("page", page=page))

    search = request.args.get("q", "").strip().lower()
    selected_filters = {key: request.args.get(key, "All") for key in config["filters"]}
    if search:
        rows = [row for row in rows if search in " ".join(str(value) for value in row.values()).lower()]
    for key, selected in selected_filters.items():
        if selected != "All":
            rows = [row for row in rows if str(row.get(key, "")) == selected]
    filter_options = {key: sorted({str(row.get(key, "")) for row in config["rows"] if row.get(key)}) for key in config["filters"]}
    return render_template("page.html", page_key=page, config=config, rows=rows, search=search, selected_filters=selected_filters, filter_options=filter_options, total=len(config["rows"]), today=date.today().isoformat())


@app.get("/reports")
@login_required
def reports():
    if session["user"]["role"] not in ("Admin", "Production Manager"):
        return redirect(url_for("page", page="orders"))
    return render_template("reports.html", monthly=[("Sep", 18400, 20000), ("Oct", 21200, 20000), ("Nov", 19800, 21000), ("Dec", 22500, 21000), ("Jan", 20100, 22000), ("Feb", 23800, 22000), ("Mar", 16200, 24000)], departments=[("Cutting", 9200, 10000), ("Sewing", 7800, 9000), ("Finishing", 6500, 8000), ("Embroidery", 3200, 4000), ("Packaging", 8900, 10000)])


@app.errorhandler(404)
def not_found(_error):
    return render_template("not_found.html"), 404


if __name__ == "__main__":
    app.run(debug=os.environ.get("FLASK_DEBUG") == "1")