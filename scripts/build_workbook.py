#!/usr/bin/env python3
"""سامانه مدیریت کارگاه بسته‌بندی حبوبات پلدختر — Excel + PDF + seed JSON."""

from __future__ import annotations

import json
import shutil
from copy import copy
from pathlib import Path

from openpyxl import Workbook
from openpyxl.cell.cell import MergedCell
from openpyxl.chart import BarChart, PieChart, Reference
from openpyxl.chart.label import DataLabelList
from openpyxl.chart.series import DataPoint
from openpyxl.chart.shapes import GraphicalProperties
from openpyxl.comments import Comment
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.styles import (
    Alignment,
    Border,
    Font,
    NamedStyle,
    PatternFill,
    Protection,
    Side,
)
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.worksheet.page import PageMargins
from openpyxl.worksheet.table import Table, TableStyleInfo
from openpyxl.chart.layout import Layout, ManualLayout
from openpyxl.drawing.line import LineProperties
from openpyxl.chart.marker import DataPoint as DP

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
ROOT = Path("/workspace")
PUBLIC = ROOT / "public" / "files"
FONTS = ROOT / "public" / "fonts"
ARTIFACTS = ROOT / "artifacts"
HOME_ART = Path("/home/workdir/artifacts")
SEED_PATH = ROOT / "src" / "lib" / "seed.json"

MAX = 150  # pre-filled formula rows per journal
LAST = MAX + 1  # last data row (header is 1)

# ---------------------------------------------------------------------------
# Colors / styles
# ---------------------------------------------------------------------------
OLIVE = "2F4A32"
OLIVE2 = "3F5E41"
CREAM = "F4EFE4"
INK = "241F18"
MUTED = "6B6256"
LINE = "C9BFAE"
INPUT_BG = "FFFBEB"
FORMULA_BG = "EEF2EE"
WHITE = "FFFFFF"
GREEN_BG = "D1E7DD"
GREEN_FG = "0F5132"
YELLOW_BG = "FFF3CD"
YELLOW_FG = "664D03"
RED_BG = "F8D7DA"
RED_FG = "842029"
HEADER_BG = "2F4A32"
SECTION_BG = "E7EDD8"
PAPER = "FFFFFF"
PAPER_RULE = "222222"
THIN = Border(
    left=Side(style="thin", color=LINE),
    right=Side(style="thin", color=LINE),
    top=Side(style="thin", color=LINE),
    bottom=Side(style="thin", color=LINE),
)
MED = Border(
    left=Side(style="medium", color=OLIVE),
    right=Side(style="medium", color=OLIVE),
    top=Side(style="medium", color=OLIVE),
    bottom=Side(style="medium", color=OLIVE),
)
PAPER_B = Border(
    left=Side(style="thin", color=PAPER_RULE),
    right=Side(style="thin", color=PAPER_RULE),
    top=Side(style="thin", color=PAPER_RULE),
    bottom=Side(style="thin", color=PAPER_RULE),
)
THICK_B = Border(
    left=Side(style="medium", color=PAPER_RULE),
    right=Side(style="medium", color=PAPER_RULE),
    top=Side(style="medium", color=PAPER_RULE),
    bottom=Side(style="medium", color=PAPER_RULE),
)

F_TITLE = Font(name="Tahoma", size=18, bold=True, color=WHITE)
F_H = Font(name="Tahoma", size=10, bold=True, color=WHITE)
F_TH = Font(name="Tahoma", size=9, bold=True, color=WHITE)
F_SEC = Font(name="Tahoma", size=12, bold=True, color=OLIVE)
F_LABEL = Font(name="Tahoma", size=9, bold=True, color=INK)
F_CELL = Font(name="Tahoma", size=9, color=INK)
F_MUTED = Font(name="Tahoma", size=8, italic=True, color=MUTED)
F_KPI = Font(name="Tahoma", size=14, bold=True, color=INK)
F_SMALL = Font(name="Tahoma", size=8, color=INK)
F_PAPER_T = Font(name="Tahoma", size=16, bold=True, color=PAPER_RULE)
F_PAPER_H = Font(name="Tahoma", size=11, bold=True, color=PAPER_RULE)
F_PAPER = Font(name="Tahoma", size=10, color=PAPER_RULE)
F_PAPER_B = Font(name="Tahoma", size=10, bold=True, color=PAPER_RULE)

FILL_H = PatternFill("solid", fgColor=HEADER_BG)
FILL_SEC = PatternFill("solid", fgColor=SECTION_BG)
FILL_IN = PatternFill("solid", fgColor=INPUT_BG)
FILL_FO = PatternFill("solid", fgColor=FORMULA_BG)
FILL_W = PatternFill("solid", fgColor=WHITE)
FILL_CREAM = PatternFill("solid", fgColor=CREAM)
FILL_G = PatternFill("solid", fgColor=GREEN_BG)
FILL_Y = PatternFill("solid", fgColor=YELLOW_BG)
FILL_R = PatternFill("solid", fgColor=RED_BG)
FILL_OLIVE = PatternFill("solid", fgColor=OLIVE)
FILL_PAPER_H = PatternFill("solid", fgColor="F0F0F0")

C_IN = Alignment(horizontal="right", vertical="center", wrap_text=True)
C_CTR = Alignment(horizontal="center", vertical="center", wrap_text=True)
C_LEFT = Alignment(horizontal="left", vertical="center", wrap_text=True)

PROT_LOCK = Protection(locked=True)
PROT_OPEN = Protection(locked=False)

# ---------------------------------------------------------------------------
# Domain data
# ---------------------------------------------------------------------------
PRODUCTS = ["لوبیا چیتی", "لوبیا قرمز", "لوبیا سفید", "عدس", "نخود", "لپه", "ماش"]
PACKS = [0.4, 0.9, 10]
PACK_LABELS = ["0.4", "0.9", "10"]
QUALITY = ["عالی", "خوب", "متوسط", "ضعیف"]
APPROVAL = ["تأیید شده", "در انتظار", "رد شده"]
CUST_TYPES = ["عمده‌فروش", "خرده‌فروش", "سوپرمارکت", "رستوران", "مصرف‌کننده"]
ABC = ["A", "B", "C"]
CUST_STATUS = ["فعال", "غیرفعال", "بالقوه"]
EXPENSE_TYPES = [
    "حقوق",
    "اجاره",
    "برق",
    "گاز",
    "سوخت",
    "بسته‌بندی",
    "تعمیرات",
    "حمل",
    "آب",
    "متفرقه",
]
PAY_METHODS = ["نقد", "کارت", "چک", "نسیه"]
CITIES = [
    "پلدختر",
    "خرم‌آباد",
    "کوهدشت",
    "رومشکان",
    "معمولان",
    "اندیمشک",
    "دزفول",
    "بروجرد",
]
LOCS = ["انبار مواد اولیه", "سالن تولید", "انبار محصول نهایی", "ماشین پخش"]
INV_KINDS = ["مواد اولیه", "محصول نهایی"]
UNITS = ["کیلوگرم", "بسته"]
ROLES = ["مدیر/مالک", "مسئول انبار", "نیروی تولید", "ویزیتور", "کمک تولید", "حسابدار"]
EMP_STATUS = ["فعال", "قطع همکاری"]
MONTHS = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
]
REGIONS = ["پلدختر شهر", "پلدختر روستا", "خرم‌آباد", "کوهدشت", "رومشکان", "معمولان"]

# Settings! cells
YR, MO, TODAY = "$B$2", "$B$3", "$B$4"

# Sample operational data (Shahrivar 1405 + a little history)
PURCHASES = [
    # date, supplier, product, kg, price, freight, quality, status, note
    ("1405/04/18", "موجودی اول دوره", "لوبیا چیتی", 180, 90000, 0, "خوب", "تأیید شده", "موجودی ابتدای کار"),
    ("1405/04/18", "موجودی اول دوره", "عدس", 80, 74000, 0, "خوب", "تأیید شده", "موجودی ابتدای کار"),
    ("1405/04/18", "موجودی اول دوره", "نخود", 90, 66000, 0, "خوب", "تأیید شده", "موجودی ابتدای کار"),
    ("1405/05/20", "کشاورز بروجرد", "لوبیا قرمز", 120, 84000, 1800000, "خوب", "تأیید شده", ""),
    ("1405/06/02", "کشاورز بروجرد", "لوبیا چیتی", 400, 92000, 2500000, "عالی", "تأیید شده", "بار تازه"),
    ("1405/06/04", "اتحادیه نخود کوهدشت", "نخود", 300, 68000, 1600000, "خوب", "تأیید شده", ""),
    ("1405/06/07", "بازرگانی حبوبات خرم‌آباد", "عدس", 250, 76000, 1400000, "خوب", "تأیید شده", ""),
    ("1405/06/08", "تأمین عدس دزفول", "عدس", 100, 79000, 900000, "ضعیف", "رد شده", "ناخالصی زیاد — برگشت"),
    ("1405/06/10", "کشاورز بروجرد", "لوبیا قرمز", 200, 85000, 1500000, "خوب", "تأیید شده", ""),
    ("1405/06/14", "تأمین عدس دزفول", "لپه", 150, 80000, 1100000, "متوسط", "تأیید شده", "با کمی نخاله"),
    ("1405/06/16", "کشت و صنعت لرستان", "لوبیا سفید", 180, 90000, 1300000, "عالی", "تأیید شده", ""),
    ("1405/06/17", "اتحادیه نخود کوهدشت", "ماش", 80, 72000, 700000, "خوب", "در انتظار", "هنوز کنترل کیفیت نشده"),
]

PRODUCTION = [
    # date, product, in_kg, clean_kg, pack_kg, operator, note
    ("1405/05/22", "لوبیا چیتی", 80, 77.2, 0.9, "مسئول بسته‌بندی", ""),
    ("1405/05/25", "عدس", 40, 38.4, 0.4, "مسئول بسته‌بندی", ""),
    ("1405/06/03", "لوبیا چیتی", 120, 116.4, 0.4, "مسئول بسته‌بندی", ""),
    ("1405/06/03", "لوبیا چیتی", 80, 77.6, 0.9, "مسئول بسته‌بندی", ""),
    ("1405/06/05", "نخود", 100, 96.5, 0.9, "مسئول بسته‌بندی", ""),
    ("1405/06/05", "نخود", 60, 58.2, 0.4, "پدر مدیر", "کمک تولید"),
    ("1405/06/08", "عدس", 90, 86.4, 0.4, "مسئول بسته‌بندی", ""),
    ("1405/06/09", "عدس", 70, 64.0, 0.9, "مسئول بسته‌بندی", "ضایعات بالاتر از معمول"),
    ("1405/06/11", "لوبیا قرمز", 80, 77.2, 0.4, "مسئول بسته‌بندی", ""),
    ("1405/06/12", "لوبیا قرمز", 70, 67.5, 0.9, "مسئول بسته‌بندی", ""),
    ("1405/06/13", "لوبیا چیتی", 100, 97.0, 10, "پدر مدیر", "بسته ۱۰ کیلویی عمده"),
    ("1405/06/15", "لپه", 80, 76.8, 0.9, "مسئول بسته‌بندی", ""),
    ("1405/06/16", "لوبیا سفید", 90, 87.3, 0.4, "مسئول بسته‌بندی", ""),
    ("1405/06/17", "نخود", 50, 48.5, 10, "پدر مدیر", ""),
    ("1405/06/18", "لوبیا چیتی", 60, 57.6, 0.9, "مسئول بسته‌بندی", ""),
]

SALES = [
    # date, customer, city, product, pack, qty, price, discount, collected, seller, note implied
    ("1405/05/26", "سوپرمارکت رضایی", "پلدختر", "لوبیا چیتی", 0.9, 40, 98000, 0, 3920000, "ویزیتور پخش"),
    ("1405/05/28", "خواربار محمدی", "پلدختر", "عدس", 0.4, 50, 42000, 0, 2100000, "ویزیتور پخش"),
    ("1405/06/04", "سوپرمارکت رضایی", "پلدختر", "لوبیا چیتی", 0.4, 80, 46000, 80000, 3600000, "ویزیتور پخش"),
    ("1405/06/04", "سوپرمارکت رضایی", "پلدختر", "نخود", 0.9, 30, 82000, 0, 2460000, "ویزیتور پخش"),
    ("1405/06/05", "فروشگاه رفاه خرم‌آباد", "خرم‌آباد", "لوبیا چیتی", 10, 8, 980000, 0, 7840000, "ویزیتور پخش"),
    ("1405/06/06", "خواربار محمدی", "پلدختر", "عدس", 0.4, 60, 43000, 0, 2580000, "ویزیتور پخش"),
    ("1405/06/07", "عمده‌فروشی حسینی", "کوهدشت", "نخود", 10, 6, 720000, 200000, 2500000, "ویزیتور پخش"),
    ("1405/06/08", "مغازه میدان", "پلدختر", "لوبیا قرمز", 0.4, 40, 44000, 0, 1760000, "ویزیتور پخش"),
    ("1405/06/09", "رستوران زاگرس", "خرم‌آباد", "عدس", 0.9, 25, 88000, 0, 0, "مدیر کارگاه"),
    ("1405/06/10", "سوپر ستاره معمولان", "معمولان", "لوبیا چیتی", 0.9, 35, 100000, 50000, 2000000, "ویزیتور پخش"),
    ("1405/06/11", "تعاونی مصرف فرهنگیان", "پلدختر", "لپه", 0.9, 20, 92000, 0, 1840000, "ویزیتور پخش"),
    ("1405/06/12", "خواربار احمدی رومشکان", "رومشکان", "لوبیا قرمز", 0.9, 28, 96000, 0, 1500000, "ویزیتور پخش"),
    ("1405/06/13", "عمده‌فروشی حسینی", "کوهدشت", "لوبیا چیتی", 10, 5, 990000, 0, 0, "ویزیتور پخش"),
    ("1405/06/14", "سوپرمارکت رضایی", "پلدختر", "لوبیا سفید", 0.4, 45, 47000, 0, 2115000, "ویزیتور پخش"),
    ("1405/06/15", "فروشگاه رفاه خرم‌آباد", "خرم‌آباد", "نخود", 0.9, 40, 84000, 100000, 2000000, "ویزیتور پخش"),
    ("1405/06/16", "پخش مواد غذایی کرمی", "اندیمشک", "لوبیا چیتی", 0.9, 50, 99000, 0, 3000000, "ویزیتور پخش"),
    ("1405/06/17", "مغازه میدان", "پلدختر", "عدس", 0.4, 35, 43000, 0, 1505000, "ویزیتور پخش"),
    ("1405/06/18", "سوپر ستاره معمولان", "معمولان", "لپه", 0.9, 18, 93000, 0, 0, "ویزیتور پخش"),
    ("1405/06/18", "خواربار محمدی", "پلدختر", "ماش", 0.4, 20, 40000, 0, 800000, "ویزیتور پخش"),
]

CUSTOMERS = [
    # name, phone, city, address, type, last_visit, status, note
    ("سوپرمارکت رضایی", "0916-111-2201", "پلدختر", "خیابان امام، پلاک ۱۲", "سوپرمارکت", "1405/06/04", "فعال", "مشتری ثابت هفتگی"),
    ("خواربار محمدی", "0916-222-3302", "پلدختر", "بازار روز، دهنه ۳", "خرده‌فروش", "1405/06/17", "فعال", ""),
    ("فروشگاه رفاه خرم‌آباد", "0916-333-4403", "خرم‌آباد", "بلوار شریعتی", "سوپرمارکت", "1405/06/15", "فعال", "سفارش عمده"),
    ("عمده‌فروشی حسینی", "0916-444-5504", "کوهدشت", "جاده پلدختر", "عمده‌فروش", "1405/06/13", "فعال", "پرداخت نسیه — پیگیری وصول"),
    ("مغازه میدان", "0916-555-6605", "پلدختر", "میدان مرکزی", "خرده‌فروش", "1405/06/17", "فعال", ""),
    ("رستوران زاگرس", "0916-666-7706", "خرم‌آباد", "بلوار ولایت", "رستوران", "1405/06/09", "فعال", "مشتری جدید — هنوز وصول نشده"),
    ("سوپر ستاره معمولان", "0916-777-8807", "معمولان", "خیابان اصلی", "سوپرمارکت", "1405/06/18", "فعال", "مشتری جدید"),
    ("تعاونی مصرف فرهنگیان", "0916-888-9908", "پلدختر", "نزدیک آموزش و پرورش", "خرده‌فروش", "1405/06/11", "فعال", ""),
    ("خواربار احمدی رومشکان", "0916-999-1010", "رومشکان", "بازار رومشکان", "خرده‌فروش", "1405/06/12", "فعال", "مشتری جدید"),
    ("پخش مواد غذایی کرمی", "0916-101-1212", "اندیمشک", "جاده اندیمشک", "عمده‌فروش", "1405/06/16", "فعال", "مسیر جدید ویزیت"),
    ("سوپر امید کوهدشت", "0916-131-1414", "کوهدشت", "فلکه مرکزی", "سوپرمارکت", "1405/05/10", "بالقوه", "ویزیت شده، هنوز خرید نکرده"),
    ("خواربار روستایی چم مهر", "0916-151-1616", "پلدختر", "چم مهر", "خرده‌فروش", "", "بالقوه", "در برنامه ویزیت هفته بعد"),
]

VISITS = [
    # date, region, planned, visited, orders, order_amt, new_cust, collected, km, fuel, note
    ("1405/06/04", "پلدختر شهر", 8, 7, 3, 7140000, 0, 6060000, 42, 420000, ""),
    ("1405/06/05", "خرم‌آباد", 6, 5, 1, 7840000, 0, 7840000, 118, 1100000, ""),
    ("1405/06/07", "کوهدشت", 7, 6, 1, 4120000, 0, 2500000, 95, 900000, "یکی از مشتری‌ها نبود"),
    ("1405/06/08", "پلدختر شهر", 6, 6, 2, 1760000, 0, 1760000, 38, 380000, ""),
    ("1405/06/09", "خرم‌آباد", 5, 4, 1, 2200000, 1, 0, 120, 1150000, "رستوران زاگرس مشتری جدید"),
    ("1405/06/10", "معمولان", 5, 4, 1, 3450000, 1, 2000000, 55, 520000, ""),
    ("1405/06/11", "پلدختر شهر", 6, 5, 1, 1840000, 0, 1840000, 40, 400000, ""),
    ("1405/06/12", "رومشکان", 5, 3, 1, 2688000, 1, 1500000, 70, 680000, "جاده خراب — ۳ ویزیت جا ماند"),
    ("1405/06/13", "کوهدشت", 6, 5, 1, 4950000, 0, 0, 98, 940000, "عمده‌فروشی نسیه گرفت"),
    ("1405/06/14", "پلدختر شهر", 5, 5, 1, 2115000, 0, 2115000, 35, 350000, ""),
    ("1405/06/15", "خرم‌آباد", 6, 5, 1, 3260000, 0, 2000000, 122, 1180000, ""),
    ("1405/06/16", "اندیمشک", 4, 3, 1, 4950000, 1, 3000000, 145, 1400000, "مسیر جدید"),
    ("1405/06/17", "پلدختر شهر", 7, 6, 2, 2305000, 0, 2305000, 44, 440000, ""),
    ("1405/06/18", "معمولان", 5, 4, 1, 1674000, 0, 800000, 58, 550000, ""),
]

EXPENSES = [
    ("1405/06/01", "اجاره", 4000000, "مدیر کارگاه", "نقد", "اجاره سوله شهریور"),
    ("1405/06/01", "حقوق", 18000000, "مدیر کارگاه", "نقد", "حقوق مدیر"),
    ("1405/06/01", "حقوق", 8000000, "مدیر کارگاه", "نقد", "حقوق مسئول انبار"),
    ("1405/06/01", "حقوق", 9000000, "مدیر کارگاه", "نقد", "حقوق بسته‌بندی"),
    ("1405/06/01", "حقوق", 10000000, "مدیر کارگاه", "نقد", "حقوق ویزیتور — بدون پورسانت"),
    ("1405/06/05", "برق", 1800000, "پدر مدیر", "کارت", "قبض برق"),
    ("1405/06/08", "بسته‌بندی", 3200000, "مدیر کارگاه", "نقد", "نایلون و کارتن"),
    ("1405/06/12", "تعمیرات", 750000, "پدر مدیر", "نقد", "تنظیم ترازو"),
    ("1405/06/15", "گاز", 600000, "پدر مدیر", "کارت", ""),
    ("1405/06/16", "سوخت", 1400000, "ویزیتور پخش", "نقد", "باک ماشین پخش"),
    ("1405/06/18", "آب", 250000, "پدر مدیر", "کارت", ""),
]

SUPPLIERS = [
    # name, phone, city, product, price, quality, pay terms, days, scores p/q/d/s/pay, status, note
    ("کشاورز بروجرد", "0916-200-1111", "بروجرد", "لوبیا چیتی", 92000, "عالی", "نقد", 2, 8, 9, 9, 8, 7, "تأیید شده", "تأمین‌کننده اصلی لوبیا"),
    ("اتحادیه نخود کوهدشت", "0916-200-2222", "کوهدشت", "نخود", 68000, "خوب", "چک ۱۰ روزه", 3, 9, 8, 8, 8, 8, "تأیید شده", ""),
    ("بازرگانی حبوبات خرم‌آباد", "0916-200-3333", "خرم‌آباد", "عدس", 76000, "خوب", "نقد", 1, 7, 8, 9, 7, 7, "تأیید شده", ""),
    ("تأمین عدس دزفول", "0916-200-4444", "دزفول", "عدس", 79000, "متوسط", "نقد", 4, 6, 5, 6, 5, 6, "در انتظار", "یک بار رد شده"),
    ("کشت و صنعت لرستان", "0916-200-5555", "خرم‌آباد", "لوبیا سفید", 90000, "عالی", "چک ۲۰ روزه", 5, 7, 9, 7, 8, 9, "تأیید شده", ""),
    ("موجودی اول دوره", "—", "پلدختر", "همه", 0, "خوب", "—", 0, 8, 8, 8, 8, 8, "تأیید شده", "ردیف سیستمی — حذف نشود"),
]

EMPLOYEES = [
    ("مدیر کارگاه", "مدیر/مالک", "خرید، فروش، مالی، تصمیم‌گیری و کنترل سیستم", 18000000, 0, "1403/01/01", "فعال", "مالک کارگاه"),
    ("پدر مدیر", "مسئول انبار", "کارهای سبک، کنترل انبار و کمک به تولید", 8000000, 0, "1403/01/01", "فعال", ""),
    ("مسئول بسته‌بندی", "نیروی تولید", "پاک‌کنی و بسته‌بندی", 9000000, 0, "1404/02/15", "فعال", "نیروی خانم"),
    ("ویزیتور پخش", "ویزیتور", "ویزیت، فروش و پخش با ماشین شرکت", 10000000, 0.02, "1404/03/01", "فعال", "نیروی آقا — پورسانت ۲٪ روی فروش وصول‌شده"),
]

INV_MOVES = [
    # date, kind, product, inn, out, unit, loc, reason
    ("1405/06/09", "مواد اولیه", "عدس", 0, 2.5, "کیلوگرم", "سالن تولید", "نمونه کنترل کیفیت"),
    ("1405/06/13", "محصول نهایی", "لوبیا چیتی", 0, 1, "کیلوگرم", "انبار محصول نهایی", "پارگی بسته — ضایعات"),
]

# KPI targets: key, name, green, yellow_bound, direction (higher|lower), unit, action_red, action_yellow
KPIS = [
    ("sales_day", "فروش روزانه", 3000000, 1500000, "higher", "تومان",
     "امروز فروش ضعیف است. با ویزیتور تماس بگیرید و مسیر را چک کنید.",
     "فروش امروز کمتر از هدف است؛ اگر قبل از ظهر است نگران نباشید."),
    ("sales_month", "فروش ماهانه", 80000000, 50000000, "higher", "تومان",
     "فروش ماه از کف فاصله گرفته. برنامه ویزیت و تخفیف هدفمند بگذارید.",
     "فروش ماه زیر هدف است. تا پایان ماه روی مشتری‌های A تمرکز کنید."),
    ("gross_profit", "سود ناخالص", 15000000, 3000000, "higher", "تومان",
     "سود ناکافی است. قیمت خرید یا فروش یا هزینه‌ها را بازبینی کنید.",
     "سود نازک شده؛ میانگین قیمت خرید را با ماه قبل مقایسه کنید."),
    ("purchases", "خرید مواد اولیه", None, None, "info", "تومان", "", ""),
    ("raw_stock", "موجودی مواد اولیه", 200, 80, "higher", "کیلوگرم",
     "مواد اولیه رو به اتمام است. امروز خرید هماهنگ کنید.",
     "موجودی مواد کم است؛ تأمین‌کننده را خبر کنید."),
    ("fin_stock", "موجودی محصول نهایی", 80, 30, "higher", "کیلوگرم",
     "محصول آماده کم است. خط تولید را اولویت بدهید.",
     "موجودی محصول در حال کاهش است."),
    ("production", "مقدار تولید", 700, 350, "higher", "کیلوگرم",
     "تولید این ماه کم است. برنامه پاک‌کنی و بسته‌بندی را ببینید.",
     "تولید زیر هدف ماه است."),
    ("waste", "درصد ضایعات", 0.03, 0.06, "lower", "درصد",
     "ضایعات بحرانی است. کیفیت خرید و کار پاک‌کنی را همان امروز بررسی کنید.",
     "ضایعات بالاتر از حد مطلوب است؛ بار مشکوک را جدا کنید."),
    ("orders", "تعداد سفارش‌ها", 15, 8, "higher", "عدد",
     "سفارش کم است. ویزیتور باید مسیرهای خوابیده را بیدار کند.",
     "تعداد سفارش زیر هدف است."),
    ("new_cust", "مشتریان جدید", 3, 1, "higher", "نفر",
     "مشتری جدید جذب نشده. یک نیم‌روز را به مشتری‌یابی اختصاص دهید.",
     "جذب مشتری جدید کند است."),
    ("collected", "مبلغ وصول‌شده", 50000000, 30000000, "higher", "تومان",
     "وصول ضعیف است. مطالبات مشتری‌های A را امروز پیگیری کنید.",
     "وصول کمتر از هدف است."),
    ("receivables", "مطالبات", 12000000, 25000000, "lower", "تومان",
     "مطالبات بالاست. تا وصول نشود سفارش نسیه جدید ندهید.",
     "مطالبات در حال رشد است؛ موعدها را چک کنید."),
    ("expenses", "هزینه‌ها", 25000000, 45000000, "lower", "تومان",
     "هزینه از سقف گذشته. خرید غیرضروری را متوقف کنید.",
     "هزینه‌ها در حال عبور از هدف است."),
    ("visit_rate", "درصد انجام ویزیت", 0.80, 0.60, "higher", "درصد",
     "ویزیت‌ها طبق برنامه نیست. علت جا ماندن مسیر را بپرسید.",
     "بخشی از ویزیت‌ها انجام نشده."),
    ("conversion", "نرخ تبدیل ویزیت به سفارش", 0.40, 0.25, "higher", "درصد",
     "ویزیت به فروش تبدیل نمی‌شود. قیمت، موجودی یا کیفیت را بررسی کنید.",
     "نرخ تبدیل پایین است."),
    ("accept_rate", "درصد بارهای قبول‌شده", 0.90, 0.75, "higher", "درصد",
     "بارهای زیادی رد می‌شود. تأمین‌کننده را عوض یا تذکر دهید.",
     "کیفیت خرید نوسان دارد."),
]


def comment(text: str) -> Comment:
    c = Comment(text, "سامانه")
    c.width = 240
    c.height = 80
    return c


def apply_rtl(ws):
    ws.sheet_view.rightToLeft = True
    ws.sheet_view.showGridLines = False
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToPage = True
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 1
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_margins = PageMargins(left=0.4, right=0.4, top=0.5, bottom=0.5, header=0.2, footer=0.2)
    ws.sheet_properties.tabColor = OLIVE
    ws.oddFooter.right.text = "کارگاه بسته‌بندی حبوبات پلدختر"
    ws.oddFooter.left.text = "&P / &N"


def set_col_widths(ws, widths: dict):
    for col, w in widths.items():
        ws.column_dimensions[col].width = w


def _set(cell, **kwargs):
    if isinstance(cell, MergedCell):
        # Merged slaves only accept fill/border via the master; skip quietly.
        return cell
    for k, v in kwargs.items():
        setattr(cell, k, v)
    return cell


def header_cell(ws, row, col, value, fill=FILL_H, font=F_TH, align=C_CTR):
    cell = ws.cell(row, col)
    if not isinstance(cell, MergedCell):
        cell.value = value
        cell.fill = fill
        cell.font = font
        cell.alignment = align
        cell.border = THIN
        cell.protection = PROT_LOCK
    else:
        cell.fill = fill
        cell.border = THIN
    return cell


def input_cell(ws, row, col, value=None, fmt=None, align=C_CTR):
    cell = ws.cell(row, col, value)
    cell.fill = FILL_IN
    cell.font = F_CELL
    cell.alignment = align
    cell.border = THIN
    cell.protection = PROT_OPEN
    if fmt:
        cell.number_format = fmt
    return cell


def formula_cell(ws, row, col, formula, fmt=None, align=C_CTR):
    cell = ws.cell(row, col, formula)
    cell.fill = FILL_FO
    cell.font = F_CELL
    cell.alignment = align
    cell.border = THIN
    cell.protection = PROT_LOCK
    if fmt:
        cell.number_format = fmt
    return cell


def label_cell(ws, row, col, value, font=F_LABEL, fill=FILL_W, align=C_CTR):
    cell = ws.cell(row, col, value)
    cell.font = font
    cell.fill = fill
    cell.alignment = align
    cell.border = THIN
    cell.protection = PROT_LOCK
    return cell


def dv_list(ws, formula, cells, allow_blank=True):
    dv = DataValidation(type="list", formula1=formula, allow_blank=allow_blank, showDropDown=False)
    dv.error = "یکی از گزینه‌های فهرست را انتخاب کنید"
    dv.errorTitle = "مقدار نامعتبر"
    dv.prompt = "از فهرست انتخاب کنید"
    dv.promptTitle = "انتخاب"
    dv.add(cells)
    ws.add_data_validation(dv)
    return dv


def dv_shamsi(ws, cells):
    # 1405/06/18 — 10 chars with slashes
    dv = DataValidation(
        type="custom",
        formula1='AND(LEN(B2)=10,MID(B2,5,1)="/",MID(B2,8,1)="/")',
        allow_blank=True,
    )
    dv.error = "تاریخ را مثل 1405/06/18 وارد کنید (سال/ماه/روز)"
    dv.errorTitle = "تاریخ شمسی"
    dv.prompt = "نمونه: 1405/06/18"
    dv.promptTitle = "تاریخ شمسی"
    dv.add(cells)
    ws.add_data_validation(dv)


def dv_shamsi_col(ws, col_letter, formula_cell_ref):
    dv = DataValidation(
        type="custom",
        formula1=f'AND(LEN({formula_cell_ref})=10,MID({formula_cell_ref},5,1)="/",MID({formula_cell_ref},8,1)="/")',
        allow_blank=True,
    )
    dv.error = "تاریخ را مثل 1405/06/18 وارد کنید"
    dv.errorTitle = "تاریخ شمسی"
    dv.prompt = "نمونه: 1405/06/18"
    dv.promptTitle = "تاریخ شمسی"
    dv.add(f"{col_letter}2:{col_letter}{LAST}")
    ws.add_data_validation(dv)


def status_cf(ws, rng):
    ws.conditional_formatting.add(
        rng,
        CellIsRule(operator="equal", formula=['"مطلوب"'], fill=FILL_G, font=Font(name="Tahoma", size=9, bold=True, color=GREEN_FG)),
    )
    ws.conditional_formatting.add(
        rng,
        CellIsRule(operator="equal", formula=['"نیاز به بررسی"'], fill=FILL_Y, font=Font(name="Tahoma", size=9, bold=True, color=YELLOW_FG)),
    )
    ws.conditional_formatting.add(
        rng,
        CellIsRule(operator="equal", formula=['"بحرانی"'], fill=FILL_R, font=Font(name="Tahoma", size=9, bold=True, color=RED_FG)),
    )


def add_table(ws, name, ref):
    tab = Table(displayName=name, ref=ref)
    tab.tableStyleInfo = TableStyleInfo(name="TableStyleMedium9", showRowStripes=True)
    ws.add_table(tab)


def protect(ws, unlocked=True):
    ws.protection.sheet = True
    ws.protection.password = ""
    ws.protection.enable()
    ws.protection.autoFilter = True
    ws.protection.sort = True
    ws.protection.selectLockedCells = True
    ws.protection.selectUnlockedCells = True


def status_formula(value_ref: str, green_ref: str, yellow_ref: str, direction: str) -> str:
    """Excel formula returning مطلوب / نیاز به بررسی / بحرانی / —."""
    if direction == "info":
        return f'IF({value_ref}="","—","—")'
    if direction == "higher":
        return (
            f'IF({value_ref}="","—",'
            f'IF({value_ref}>={green_ref},"مطلوب",'
            f'IF({value_ref}>={yellow_ref},"نیاز به بررسی","بحرانی")))'
        )
    # lower is better
    return (
        f'IF({value_ref}="","—",'
        f'IF({value_ref}<={green_ref},"مطلوب",'
        f'IF({value_ref}<={yellow_ref},"نیاز به بررسی","بحرانی")))'
    )


def year_f(date_ref: str) -> str:
    return f'IF({date_ref}="","",VALUE(LEFT({date_ref},4)))'


def month_f(date_ref: str) -> str:
    return f'IF({date_ref}="","",VALUE(MID({date_ref},6,2)))'


# ===========================================================================
# SHEETS
# ===========================================================================

def build_lists(wb: Workbook):
    ws = wb.create_sheet("Lists")
    apply_rtl(ws)
    ws.sheet_properties.tabColor = "888888"
    ws.sheet_state = "hidden"

    columns = {
        "A": ("محصولات", PRODUCTS),
        "B": ("وزن_بسته", PACKS),
        "C": ("کیفیت", QUALITY),
        "D": ("وضعیت_تأیید", APPROVAL),
        "E": ("نوع_مشتری", CUST_TYPES),
        "F": ("ABC", ABC),
        "G": ("وضعیت_مشتری", CUST_STATUS),
        "H": ("نوع_هزینه", EXPENSE_TYPES),
        "I": ("روش_پرداخت", PAY_METHODS),
        "J": ("شهرها", CITIES),
        "K": ("محل", LOCS),
        "L": ("نوع_موجودی", INV_KINDS),
        "M": ("واحد", UNITS),
        "N": ("سمت", ROLES),
        "O": ("وضعیت_کار", EMP_STATUS),
        "P": ("مناطق", REGIONS),
        "Q": ("ماه_نام", MONTHS),
        "R": ("کارکنان", [e[0] for e in EMPLOYEES]),
    }
    for col, (title, items) in columns.items():
        header_cell(ws, 1, ord(col) - 64, title)
        for i, item in enumerate(items, 2):
            label_cell(ws, i, ord(col) - 64, item, font=F_CELL)

    # Month numbers 1-12
    header_cell(ws, 1, 19, "شماره_ماه")
    for i in range(1, 13):
        label_cell(ws, i + 1, 19, i, font=F_CELL)

    # Chart data (live formulas) — sales by product this month
    header_cell(ws, 1, 21, "محصول")
    header_cell(ws, 1, 22, "فروش_تومان")
    header_cell(ws, 1, 23, "تولید_کیلو")
    for i, p in enumerate(PRODUCTS, 2):
        label_cell(ws, i, 21, p, font=F_CELL)
        formula_cell(
            ws, i, 22,
            f'=SUMIFS(Sales!$L$2:$L${LAST},Sales!$E$2:$E${LAST},U{i},Sales!$P$2:$P${LAST},تنظیمات!{YR},Sales!$Q$2:$Q${LAST},تنظیمات!{MO})',
            "#,##0",
        )
        formula_cell(
            ws, i, 23,
            f'=SUMIFS(Production!$E$2:$E${LAST},Production!$C$2:$C${LAST},U{i},Production!$M$2:$M${LAST},تنظیمات!{YR},Production!$N$2:$N${LAST},تنظیمات!{MO})',
            "#,##0.00",
        )

    # Named ranges
    from openpyxl.workbook.defined_name import DefinedName

    def nm(name, ref):
        wb.defined_names.add(DefinedName(name, attr_text=ref))

    nm("ProductsList", "Lists!$A$2:$A$8")
    nm("PacksList", "Lists!$B$2:$B$4")
    nm("QualityList", "Lists!$C$2:$C$5")
    nm("ApprovalList", "Lists!$D$2:$D$4")
    nm("CustTypeList", "Lists!$E$2:$E$6")
    nm("ABCList", "Lists!$F$2:$F$4")
    nm("CustStatusList", "Lists!$G$2:$G$4")
    nm("ExpenseList", "Lists!$H$2:$H$11")
    nm("PayList", "Lists!$I$2:$I$5")
    nm("CityList", "Lists!$J$2:$J$9")
    nm("LocList", "Lists!$K$2:$K$5")
    nm("InvKindList", "Lists!$L$2:$L$3")
    nm("UnitList", "Lists!$M$2:$M$3")
    nm("RoleList", "Lists!$N$2:$N$7")
    nm("EmpStatusList", "Lists!$O$2:$O$3")
    nm("RegionList", "Lists!$P$2:$P$7")
    nm("StaffList", "Lists!$R$2:$R$21")
    nm("SupplierNames", f"Suppliers!$A$2:$A${LAST}")
    nm("CustomerNames", f"Customers!$A$2:$A${LAST}")
    nm("CurrentYear", "تنظیمات!$B$2")
    nm("CurrentMonth", "تنظیمات!$B$3")
    nm("TodayShamsi", "تنظیمات!$B$4")

    set_col_widths(ws, {get_column_letter(i): 18 for i in range(1, 25)})
    return ws


def build_settings(wb: Workbook):
    ws = wb.create_sheet("تنظیمات")
    apply_rtl(ws)
    ws.sheet_properties.tabColor = "4A6741"
    ws.merge_cells("A1:G1")
    c = ws["A1"]
    c.value = "تنظیمات و اهداف قابل‌تغییر — این اعداد چراغ داشبورد را عوض می‌کنند"
    c.font = F_TITLE
    c.fill = FILL_OLIVE
    c.alignment = C_CTR
    ws.row_dimensions[1].height = 32

    ws.merge_cells("A2:A4")
    # parameters
    params = [
        (2, "سال جاری", 1405, "سال شمسی گزارش داشبورد"),
        (3, "ماه جاری", 6, "۱ تا ۱۲ — الان شهریور"),
        (4, "تاریخ امروز", "1405/06/18", "هر روز این را عوض کنید (فروش روزانه از روی این تاریخ است)"),
        (5, "نام کارگاه", "کارگاه بسته‌بندی حبوبات پلدختر", ""),
        (6, "شهر", "پلدختر", ""),
        (7, "آستانه مشتری A (تومان)", 20000000, "مجموع خرید بالاتر از این = مشتری A"),
        (8, "آستانه مشتری B (تومان)", 5000000, "بین B و A = مشتری B، کمتر = C"),
        (9, "حداقل موجودی مواد (کیلو)", 200, "کمتر از این در انبار مواد = هشدار"),
        (10, "حداقل موجودی محصول (کیلو)", 80, "کمتر از این در محصول نهایی = هشدار"),
    ]
    header_cell(ws, 1, 1, ws["A1"].value)  # already merged
    labels = ["پارامتر", "مقدار", "توضیح"]
    for i, t in enumerate(["A", "B", "C"], 1):
        pass
    header_cell(ws, 12, 1, "پارامتر")
    # rewrite row 1 properly
    ws["A1"].value = "تنظیمات و اهداف قابل‌تغییر — این اعداد چراغ داشبورد را عوض می‌کنند"

    header_cell(ws, 13, 1, "پارامتر")
    header_cell(ws, 13, 2, "مقدار (قابل ویرایش)")
    header_cell(ws, 13, 3, "توضیح")

    # Put params at rows 2-10 without the extra header confusion
    # Clear row 12-13 mistake - I'll use rows 3-11 for params under a section
    # Actually let me just write cleanly at rows 3+

    # Reset A1 style
    ws.merge_cells("A1:F1")

    ws.merge_cells("A3:F3")
    header_cell(ws, 3, 1, "۱) مشخصات کارگاه و دوره گزارش")
    for col in range(2, 7):
        header_cell(ws, 3, col, "")

    headers_p = ["پارامتر", "مقدار", "توضیح"]
    for i, h in enumerate(headers_p, 1):
        header_cell(ws, 4, i, h)
    for idx, (r, name, val, note) in enumerate(params):
        row = 5 + idx
        label_cell(ws, row, 1, name, fill=FILL_SEC, align=C_CTR)
        cell = input_cell(ws, row, 2, val, align=C_CTR)
        if isinstance(val, int) and val > 100:
            cell.number_format = "#,##0"
        label_cell(ws, row, 3, note, font=F_MUTED, fill=FILL_W, align=C_RIGHT if False else C_CTR)
        ws.merge_cells(start_row=row, start_column=3, end_row=row, end_column=6)

    # Named cells sit at B5=year because params start at row 5:
    # 5 year, 6 month, 7 today, 8 name, 9 city, 10 A thresh, 11 B thresh, 12 min raw, 13 min fin
    # WAIT I used `row = 5 + idx` and params have first field `r` unused. So:
    # row5 year, row6 month, row7 today, row8 name, row9 city, row10 A, row11 B, row12 min raw, row13 min fin

    # I referenced YR=$B$2 earlier! I need to fix named ranges and all formulas to actual cells.
    # Let me put the three critical params in B2 B3 B4 as originally planned, ABOVE the section.

    # Simplest fix: write B2 B3 B4 explicitly as the source of truth, and the table below mirrors them
    # with formulas. Manager edits B2 B3 B4 in the top strip.

    # Top strip
    ws["A2"] = "سال"
    ws["A2"].font = F_LABEL
    ws["A2"].fill = FILL_SEC
    ws["A2"].alignment = C_CTR
    ws["A2"].border = THIN
    ws["A2"].protection = PROT_LOCK
    input_cell(ws, 2, 2, 1405)
    ws["C2"] = "ماه"
    ws["C2"].font = F_LABEL
    ws["C2"].fill = FILL_SEC
    ws["C2"].alignment = C_CTR
    ws["C2"].border = THIN
    input_cell(ws, 2, 4, 6)
    ws["E2"] = "تاریخ امروز"
    ws["E2"].font = F_LABEL
    ws["E2"].fill = FILL_SEC
    ws["E2"].alignment = C_CTR
    ws["E2"].border = THIN
    input_cell(ws, 2, 6, "1405/06/18")
    ws["B2"].number_format = "0"
    ws["D2"].number_format = "0"

    # The table at rows 5-13 should POINT to B2/D2/F2 for year/month/today so there's one source
    # Find which table row is year/month/today and use formulas
    # params[0] year -> row 5: B5 = $B$2
    # params[1] month -> row 6: B6 = $D$2
    # params[2] today -> row 7: B7 = $F$2

    ws["B5"] = "=$B$2"
    ws["B5"].fill = FILL_FO
    ws["B5"].protection = PROT_LOCK
    ws["B5"].font = F_CELL
    ws["B5"].alignment = C_CTR
    ws["B5"].border = THIN

    ws["B6"] = "=$D$2"
    ws["B6"].fill = FILL_FO
    ws["B6"].protection = PROT_LOCK
    ws["B6"].font = F_CELL
    ws["B6"].alignment = C_CTR
    ws["B6"].border = THIN

    ws["B7"] = "=$F$2"
    ws["B7"].fill = FILL_FO
    ws["B7"].protection = PROT_LOCK
    ws["B7"].font = F_CELL
    ws["B7"].alignment = C_CTR
    ws["B7"].border = THIN

    # KPI targets table
    start = 16
    ws.merge_cells(start_row=start, start_column=1, end_row=start, end_column=7)
    header_cell(ws, start, 1, "۲) اهداف KPI — مقدار مطلوب و آستانه بررسی را خودتان عوض کنید")
    for col in range(2, 8):
        header_cell(ws, start, col, "")

    heads = ["شناسه", "شاخص", "هدف مطلوب (سبز)", "آستانه بررسی (زرد)", "جهت", "واحد", "اقدام وقتی قرمز شد"]
    for i, h in enumerate(heads, 1):
        header_cell(ws, start + 1, i, h)

    for i, k in enumerate(KPIS):
        row = start + 2 + i
        label_cell(ws, row, 1, k[0], font=F_SMALL, fill=FILL_FO)
        label_cell(ws, row, 2, k[1], fill=FILL_SEC)
        if k[2] is None:
            label_cell(ws, row, 3, "—", fill=FILL_FO)
            label_cell(ws, row, 4, "—", fill=FILL_FO)
        else:
            fmt = "0.0%" if k[5] == "درصد" else ("#,##0" if k[5] == "تومان" else "0.00")
            input_cell(ws, row, 3, k[2], fmt)
            input_cell(ws, row, 4, k[3], fmt)
        label_cell(ws, row, 5, k[4], fill=FILL_FO)
        label_cell(ws, row, 6, k[5], fill=FILL_FO)
        input_cell(ws, row, 7, k[6], align=C_CTR)
        ws.row_dimensions[row].height = 22

    # Legend
    r = start + 2 + len(KPIS) + 1
    ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=7)
    header_cell(ws, r, 1, "۳) معنی چراغ‌ها")
    for col in range(2, 8):
        header_cell(ws, r, col, "")
    legend = [
        (r + 1, "مطلوب", FILL_G, Font(name="Tahoma", size=10, bold=True, color=GREEN_FG),
         "همه‌چیز در محدوده هدف است. دخالت لازم نیست."),
        (r + 2, "نیاز به بررسی", FILL_Y, Font(name="Tahoma", size=10, bold=True, color=YELLOW_FG),
         "در حال فاصله گرفتن از هدف. این هفته زیر نظر بگیرید."),
        (r + 3, "بحرانی", FILL_R, Font(name="Tahoma", size=10, bold=True, color=RED_FG),
         "همان روز اقدام کنید. متن اقدام در ستون آخر جدول بالاست."),
        (r + 4, "—", FILL_FO, F_MUTED, "شاخص اطلاعاتی است یا هنوز داده‌ای وارد نشده."),
    ]
    for row, title, fill, font, desc in legend:
        c = ws.cell(row, 1, title)
        c.fill = fill
        c.font = font
        c.alignment = C_CTR
        c.border = THIN
        ws.merge_cells(start_row=row, start_column=2, end_row=row, end_column=7)
        label_cell(ws, row, 2, desc, font=F_CELL, align=C_CTR)
        for col in range(3, 8):
            ws.cell(row, col).border = THIN
            ws.cell(row, col).fill = FILL_W

    r2 = r + 6
    ws.merge_cells(start_row=r2, start_column=1, end_row=r2 + 3, end_column=7)
    note = (
        "نکته تاریخ شمسی: تاریخ‌ها را همیشه به صورت متن ۱۰ کاراکتری سال/ماه/روز وارد کنید؛ "
        "مثال ۱۴۰۵/۰۶/۱۸ را با اعداد انگلیسی بنویسید: 1405/06/18. "
        "سال و ماه داشبورد از ردیف ۲ همین برگه خوانده می‌شود. "
        "سلول‌های کرم‌رنگ را می‌توانید عوض کنید؛ سلول‌های خاکستری فرمول هستند."
    )
    c = ws.cell(r2, 1, note)
    c.alignment = Alignment(horizontal="right", vertical="center", wrap_text=True)
    c.font = F_MUTED
    c.fill = FILL_CREAM

    set_col_widths(ws, {"A": 28, "B": 26, "C": 22, "D": 24, "E": 14, "F": 22, "G": 62})
    ws.freeze_panes = "A5"
    ws.row_dimensions[2].height = 26
    protect(ws)
    # unlock year/month/today and target numbers
    for col in (2, 4, 6):
        ws.cell(2, col).protection = PROT_OPEN
    for row in range(8, 14):  # name, city, thresholds
        ws.cell(row, 2).protection = PROT_OPEN
    for i in range(len(KPIS)):
        row = 18 + i
        ws.cell(row, 3).protection = PROT_OPEN
        ws.cell(row, 4).protection = PROT_OPEN
        ws.cell(row, 7).protection = PROT_OPEN
    return ws


def journal_title(ws, title, subtitle, color=OLIVE):
    ws.merge_cells("A1:N1")
    c = ws["A1"]
    c.value = title
    c.font = F_TITLE
    c.fill = PatternFill("solid", fgColor=color)
    c.alignment = C_CTR
    c.protection = PROT_LOCK
    ws.row_dimensions[1].height = 28
    ws.merge_cells("A2:N2")
    c = ws["A2"]
    c.value = subtitle
    c.font = F_MUTED
    c.fill = FILL_CREAM
    c.alignment = C_CTR
    c.protection = PROT_LOCK
    ws.row_dimensions[2].height = 20


def fill_year_month(ws, date_col: str, year_col_idx: int, month_col_idx: int):
    ylet = get_column_letter(year_col_idx)
    mlet = get_column_letter(month_col_idx)
    for r in range(4, LAST + 1):
        formula_cell(ws, r, year_col_idx, f'={year_f(f"{date_col}{r}")}', "0")
        formula_cell(ws, r, month_col_idx, f'={month_f(f"{date_col}{r}")}', "0")


def build_purchases(wb: Workbook):
    ws = wb.create_sheet("Purchases")
    apply_rtl(ws)
    journal_title(
        ws,
        "خرید مواد اولیه",
        "سلول کرم = ورود اطلاعات | خاکستری = محاسبه خودکار | تاریخ: 1405/06/18 | فقط بار «تأیید شده» وارد موجودی و هزینه می‌شود",
    )
    headers = [
        "ردیف", "تاریخ شمسی", "تأمین‌کننده", "نوع حبوبات", "مقدار (کیلو)",
        "قیمت هر کیلو", "مبلغ کل", "هزینه حمل", "قیمت تمام‌شده هر کیلو",
        "کیفیت", "وضعیت تأیید", "توضیحات", "سال", "ماه",
    ]
    for i, h in enumerate(headers, 1):
        header_cell(ws, 3, i, h)
    ws.row_dimensions[3].height = 28
    ws.freeze_panes = "A4"
    ws.auto_filter.ref = f"A3:N{LAST}"

    for r in range(4, LAST + 1):
        formula_cell(ws, r, 1, f'=IF(B{r}="","",ROW()-3)', "0")
        input_cell(ws, r, 2)
        input_cell(ws, r, 3)
        input_cell(ws, r, 4)
        input_cell(ws, r, 5, fmt="#,##0.00")
        input_cell(ws, r, 6, fmt="#,##0")
        formula_cell(ws, r, 7, f'=IF(OR(E{r}="",F{r}=""),"",E{r}*F{r})', "#,##0")
        input_cell(ws, r, 8, fmt="#,##0")
        formula_cell(ws, r, 9, f'=IF(OR(E{r}="",E{r}=0),"",(G{r}+IF(H{r}="",0,H{r}))/E{r})', "#,##0")
        input_cell(ws, r, 10)
        input_cell(ws, r, 11)
        input_cell(ws, r, 12, align=C_CTR)
        formula_cell(ws, r, 13, f'={year_f(f"B{r}")}', "0")
        formula_cell(ws, r, 14, f'={month_f(f"B{r}")}', "0")
        ws.row_dimensions[r].height = 20

    # sample
    for i, p in enumerate(PURCHASES):
        r = 4 + i
        ws.cell(r, 2).value = p[0]
        ws.cell(r, 3).value = p[1]
        ws.cell(r, 4).value = p[2]
        ws.cell(r, 5).value = p[3]
        ws.cell(r, 6).value = p[4]
        ws.cell(r, 8).value = p[5]
        ws.cell(r, 10).value = p[6]
        ws.cell(r, 11).value = p[7]
        ws.cell(r, 12).value = p[8]

    dv_shamsi_col(ws, "B", "B4")
    # fix validation formula to use first cell of range — Excel adjusts
    ws.data_validations.dataValidation[-1].formula1 = 'AND(LEN(B4)=10,MID(B4,5,1)="/",MID(B4,8,1)="/")'
    dv_list(ws, "=SupplierNames", f"C4:C{LAST}")
    dv_list(ws, "=ProductsList", f"D4:D{LAST}")
    dv_list(ws, "=QualityList", f"J4:J{LAST}")
    dv_list(ws, "=ApprovalList", f"K4:K{LAST}")

    # CF quality weak / rejected
    ws.conditional_formatting.add(
        f"K4:K{LAST}",
        CellIsRule(operator="equal", formula=['"رد شده"'], fill=FILL_R, font=Font(name="Tahoma", size=9, color=RED_FG)),
    )
    ws.conditional_formatting.add(
        f"K4:K{LAST}",
        CellIsRule(operator="equal", formula=['"تأیید شده"'], fill=FILL_G, font=Font(name="Tahoma", size=9, color=GREEN_FG)),
    )
    ws.conditional_formatting.add(
        f"K4:K{LAST}",
        CellIsRule(operator="equal", formula=['"در انتظار"'], fill=FILL_Y, font=Font(name="Tahoma", size=9, color=YELLOW_FG)),
    )

    ws["B3"].comment = comment("تاریخ شمسی با اعداد انگلیسی: 1405/06/18")
    ws["I3"].comment = comment("(مبلغ کل + حمل) ÷ مقدار")
    ws["K3"].comment = comment("فقط «تأیید شده» در موجودی و هزینه خرید ماه حساب می‌شود")

    set_col_widths(ws, {
        "A": 8, "B": 14, "C": 26, "D": 14, "E": 14, "F": 14, "G": 14,
        "H": 14, "I": 20, "J": 10, "K": 14, "L": 28, "M": 8, "N": 8,
    })
    add_table(ws, "PurchasesTbl", f"A3:N{LAST}")
    protect(ws)
    return ws


def build_production(wb: Workbook):
    ws = wb.create_sheet("Production")
    apply_rtl(ws)
    journal_title(
        ws,
        "تولید و بسته‌بندی",
        "ورود: تاریخ، نوع، مقدار ورودی، مقدار پاک‌شده، وزن بسته، اپراتور | ضایعات، درصد، تعداد بسته و خطای وزن خودکار است",
    )
    headers = [
        "ردیف", "تاریخ شمسی", "نوع حبوبات", "مقدار ورودی (کیلو)", "مقدار پاک‌شده (کیلو)",
        "مقدار ضایعات", "درصد ضایعات", "وزن بسته (کیلو)", "تعداد بسته", "خطای وزن (کیلو)",
        "اپراتور", "توضیحات", "سال", "ماه",
    ]
    for i, h in enumerate(headers, 1):
        header_cell(ws, 3, i, h)
    ws.row_dimensions[3].height = 28
    ws.freeze_panes = "A4"
    ws.auto_filter.ref = f"A3:N{LAST}"

    for r in range(4, LAST + 1):
        formula_cell(ws, r, 1, f'=IF(B{r}="","",ROW()-3)', "0")
        input_cell(ws, r, 2)
        input_cell(ws, r, 3)
        input_cell(ws, r, 4, fmt="#,##0.00")
        input_cell(ws, r, 5, fmt="#,##0.00")
        formula_cell(ws, r, 6, f'=IF(OR(D{r}="",E{r}=""),"",D{r}-E{r})', "#,##0.00")
        formula_cell(ws, r, 7, f'=IF(OR(D{r}="",D{r}=0),"",F{r}/D{r})', "0.0%")
        input_cell(ws, r, 8, fmt="0.00")
        formula_cell(ws, r, 9, f'=IF(OR(E{r}="",H{r}="",H{r}=0),"",INT(E{r}/H{r}))', "#,##0")
        formula_cell(ws, r, 10, f'=IF(OR(E{r}="",H{r}="",I{r}=""),"",E{r}-I{r}*H{r})', "#,##0.00")
        input_cell(ws, r, 11)
        input_cell(ws, r, 12)
        formula_cell(ws, r, 13, f'={year_f(f"B{r}")}', "0")
        formula_cell(ws, r, 14, f'={month_f(f"B{r}")}', "0")
        ws.row_dimensions[r].height = 20

    for i, p in enumerate(PRODUCTION):
        r = 4 + i
        ws.cell(r, 2).value = p[0]
        ws.cell(r, 3).value = p[1]
        ws.cell(r, 4).value = p[2]
        ws.cell(r, 5).value = p[3]
        ws.cell(r, 8).value = p[4]
        ws.cell(r, 11).value = p[5]
        ws.cell(r, 12).value = p[6]

    dv = DataValidation(
        type="custom",
        formula1='AND(LEN(B4)=10,MID(B4,5,1)="/",MID(B4,8,1)="/")',
        allow_blank=True,
    )
    dv.error = "تاریخ را مثل 1405/06/18 وارد کنید"
    dv.add(f"B4:B{LAST}")
    ws.add_data_validation(dv)
    dv_list(ws, "=ProductsList", f"C4:C{LAST}")
    dv_list(ws, "=PacksList", f"H4:H{LAST}")
    dv_list(ws, "=StaffList", f"K4:K{LAST}")

    ws.conditional_formatting.add(
        f"G4:G{LAST}",
        CellIsRule(operator="greaterThan", formula=["0.06"], fill=FILL_R, font=Font(name="Tahoma", size=9, color=RED_FG)),
    )
    ws.conditional_formatting.add(
        f"G4:G{LAST}",
        CellIsRule(operator="between", formula=["0.03", "0.06"], fill=FILL_Y, font=Font(name="Tahoma", size=9, color=YELLOW_FG)),
    )
    ws.conditional_formatting.add(
        f"G4:G{LAST}",
        CellIsRule(operator="lessThan", formula=["0.03"], fill=FILL_G, font=Font(name="Tahoma", size=9, color=GREEN_FG)),
    )

    ws["F3"].comment = comment("ورودی − پاک‌شده")
    ws["I3"].comment = comment("جزء صحیح پاک‌شده ÷ وزن بسته")
    ws["J3"].comment = comment("باقی‌مانده‌ای که بسته نشده (باید نزدیک صفر باشد)")
    ws["H3"].comment = comment("۰.۴ = ۴۰۰ گرم | ۰.۹ = ۹۰۰ گرم | ۱۰ = کیسه ۱۰ کیلویی")

    set_col_widths(ws, {
        "A": 8, "B": 14, "C": 14, "D": 18, "E": 20, "F": 14, "G": 14,
        "H": 16, "I": 12, "J": 16, "K": 18, "L": 26, "M": 8, "N": 8,
    })
    add_table(ws, "ProductionTbl", f"A3:N{LAST}")
    protect(ws)
    return ws


def build_sales(wb: Workbook):
    ws = wb.create_sheet("Sales")
    apply_rtl(ws)
    journal_title(
        ws,
        "فروش",
        "مبلغ فروش، مبلغ نهایی و مانده حساب خودکار است. وصول را همین‌جا بزنید تا مطالبات داشبورد درست بماند.",
    )
    headers = [
        "ردیف", "تاریخ شمسی", "نام مشتری", "شهر/منطقه", "محصول",
        "وزن بسته (کیلو)", "تعداد", "وزن کل (کیلو)", "قیمت واحد", "مبلغ فروش",
        "تخفیف", "مبلغ نهایی", "مبلغ وصول‌شده", "مانده حساب", "فروشنده",
        "سال", "ماه",
    ]
    for i, h in enumerate(headers, 1):
        header_cell(ws, 3, i, h)
    ws.row_dimensions[3].height = 28
    ws.freeze_panes = "A4"
    ws.auto_filter.ref = f"A3:Q{LAST}"

    for r in range(4, LAST + 1):
        formula_cell(ws, r, 1, f'=IF(B{r}="","",ROW()-3)', "0")
        input_cell(ws, r, 2)
        input_cell(ws, r, 3)
        input_cell(ws, r, 4)
        input_cell(ws, r, 5)
        input_cell(ws, r, 6, fmt="0.00")
        input_cell(ws, r, 7, fmt="#,##0")
        formula_cell(ws, r, 8, f'=IF(OR(F{r}="",G{r}=""),"",F{r}*G{r})', "#,##0.00")
        input_cell(ws, r, 9, fmt="#,##0")
        formula_cell(ws, r, 10, f'=IF(OR(G{r}="",I{r}=""),"",G{r}*I{r})', "#,##0")
        input_cell(ws, r, 11, fmt="#,##0")
        formula_cell(ws, r, 12, f'=IF(J{r}="","",J{r}-IF(K{r}="",0,K{r}))', "#,##0")
        input_cell(ws, r, 13, fmt="#,##0")
        formula_cell(ws, r, 14, f'=IF(L{r}="","",L{r}-IF(M{r}="",0,M{r}))', "#,##0")
        input_cell(ws, r, 15)
        formula_cell(ws, r, 16, f'={year_f(f"B{r}")}', "0")
        formula_cell(ws, r, 17, f'={month_f(f"B{r}")}', "0")
        ws.row_dimensions[r].height = 20

    for i, s in enumerate(SALES):
        r = 4 + i
        for col, val in enumerate(s[:11], 2):
            # map tuple to cols: 2 date,3 cust,4 city,5 prod,6 pack,7 qty,8 skip formula,9 price,11 disc,13 collected,15 seller
            pass
        ws.cell(r, 2).value = s[0]
        ws.cell(r, 3).value = s[1]
        ws.cell(r, 4).value = s[2]
        ws.cell(r, 5).value = s[3]
        ws.cell(r, 6).value = s[4]
        ws.cell(r, 7).value = s[5]
        ws.cell(r, 9).value = s[6]
        ws.cell(r, 11).value = s[7]
        ws.cell(r, 13).value = s[8]
        ws.cell(r, 15).value = s[9]

    dv = DataValidation(type="custom", formula1='AND(LEN(B4)=10,MID(B4,5,1)="/",MID(B4,8,1)="/")', allow_blank=True)
    dv.error = "تاریخ را مثل 1405/06/18 وارد کنید"
    dv.add(f"B4:B{LAST}")
    ws.add_data_validation(dv)
    dv_list(ws, "=CustomerNames", f"C4:C{LAST}")
    dv_list(ws, "=CityList", f"D4:D{LAST}")
    dv_list(ws, "=ProductsList", f"E4:E{LAST}")
    dv_list(ws, "=PacksList", f"F4:F{LAST}")
    dv_list(ws, "=StaffList", f"O4:O{LAST}")

    ws.conditional_formatting.add(
        f"N4:N{LAST}",
        CellIsRule(operator="greaterThan", formula=["0"], fill=FILL_Y, font=Font(name="Tahoma", size=9, color=YELLOW_FG)),
    )
    ws.conditional_formatting.add(
        f"N4:N{LAST}",
        CellIsRule(operator="equal", formula=["0"], fill=FILL_G, font=Font(name="Tahoma", size=9, color=GREEN_FG)),
    )

    ws["N3"].comment = comment("مبلغ نهایی − وصول. اگر صفر باشد حساب تسویه است.")
    ws["H3"].comment = comment("تعداد × وزن بسته")
    ws["J3"].comment = comment("تعداد × قیمت واحد (قیمت هر بسته)")

    set_col_widths(ws, {
        "A": 8, "B": 14, "C": 24, "D": 14, "E": 14, "F": 16, "G": 10,
        "H": 14, "I": 12, "J": 14, "K": 12, "L": 14, "M": 16, "N": 14,
        "O": 16, "P": 8, "Q": 8,
    })
    add_table(ws, "SalesTbl", f"A3:Q{LAST}")
    protect(ws)
    return ws


def build_customers(wb: Workbook):
    ws = wb.create_sheet("Customers")
    apply_rtl(ws)
    journal_title(
        ws,
        "دفتر مشتریان",
        "نام و مشخصات را وارد کنید. آخرین خرید، مجموع خرید و دسته A/B/C از روی برگه فروش خودکار پر می‌شود.",
    )
    headers = [
        "نام مشتری", "شماره تماس", "شهر", "آدرس", "نوع مشتری",
        "آخرین ویزیت", "اولین خرید", "آخرین خرید", "مجموع خرید (تومان)",
        "دسته", "وضعیت", "توضیحات",
    ]
    for i, h in enumerate(headers, 1):
        header_cell(ws, 3, i, h)
    ws.row_dimensions[3].height = 28
    ws.freeze_panes = "A4"
    ws.auto_filter.ref = f"A3:L{LAST}"

    for r in range(4, LAST + 1):
        input_cell(ws, r, 1, align=C_CTR)
        input_cell(ws, r, 2)
        input_cell(ws, r, 3)
        input_cell(ws, r, 4)
        input_cell(ws, r, 5)
        input_cell(ws, r, 6)
        formula_cell(
            ws, r, 7,
            f'=IF(A{r}="","",IFERROR(MINIFS(Sales!$B$4:$B${LAST},Sales!$C$4:$C${LAST},A{r}),"—"))',
        )
        formula_cell(
            ws, r, 8,
            f'=IF(A{r}="","",IFERROR(MAXIFS(Sales!$B$4:$B${LAST},Sales!$C$4:$C${LAST},A{r}),"—"))',
        )
        formula_cell(
            ws, r, 9,
            f'=IF(A{r}="","",SUMIF(Sales!$C$4:$C${LAST},A{r},Sales!$L$4:$L${LAST}))',
            "#,##0",
        )
        formula_cell(
            ws, r, 10,
            f'=IF(OR(A{r}="",I{r}=""),"",IF(I{r}>=تنظیمات!$B$10,"A",IF(I{r}>=تنظیمات!$B$11,"B","C")))',
        )
        input_cell(ws, r, 11)
        input_cell(ws, r, 12)
        ws.row_dimensions[r].height = 20

    for i, c in enumerate(CUSTOMERS):
        r = 4 + i
        ws.cell(r, 1).value = c[0]
        ws.cell(r, 2).value = c[1]
        ws.cell(r, 3).value = c[2]
        ws.cell(r, 4).value = c[3]
        ws.cell(r, 5).value = c[4]
        ws.cell(r, 6).value = c[5]
        ws.cell(r, 11).value = c[6]
        ws.cell(r, 12).value = c[7]

    dv_list(ws, "=CityList", f"C4:C{LAST}")
    dv_list(ws, "=CustTypeList", f"E4:E{LAST}")
    dv_list(ws, "=CustStatusList", f"K4:K{LAST}")
    status_cf(ws, f"J4:J{LAST}")  # won't match A/B/C
    ws.conditional_formatting.add(
        f"J4:J{LAST}",
        CellIsRule(operator="equal", formula=['"A"'], fill=FILL_G, font=Font(name="Tahoma", size=9, bold=True, color=GREEN_FG)),
    )
    ws.conditional_formatting.add(
        f"J4:J{LAST}",
        CellIsRule(operator="equal", formula=['"B"'], fill=FILL_Y, font=Font(name="Tahoma", size=9, bold=True, color=YELLOW_FG)),
    )
    ws.conditional_formatting.add(
        f"J4:J{LAST}",
        CellIsRule(operator="equal", formula=['"C"'], fill=FILL_W, font=Font(name="Tahoma", size=9, color=MUTED)),
    )

    ws["J3"].comment = comment("A/B/C از مجموع خرید و آستانه‌های برگه تنظیمات")
    ws["G3"].comment = comment("اولین فاکتور در Sales — برای شمارش مشتری جدید ماه")

    set_col_widths(ws, {
        "A": 26, "B": 16, "C": 14, "D": 28, "E": 14, "F": 14,
        "G": 14, "H": 14, "I": 20, "J": 10, "K": 12, "L": 36,
    })
    add_table(ws, "CustomersTbl", f"A3:L{LAST}")
    protect(ws)
    return ws


def build_salesrep(wb: Workbook):
    ws = wb.create_sheet("SalesRep")
    apply_rtl(ws)
    journal_title(
        ws,
        "گزارش ویزیتور / پخش",
        "درصد انجام ویزیت و نرخ تبدیل خودکار است. هر روز یک ردیف — از روی فرم کاغذی ویزیتور.",
    )
    headers = [
        "ردیف", "تاریخ شمسی", "منطقه", "برنامه‌ریزی‌شده", "ویزیت‌شده",
        "سفارش گرفته‌شده", "مبلغ سفارش", "مشتری جدید", "مبلغ وصول‌شده",
        "کیلومتر", "هزینه سوخت", "توضیحات",
        "درصد انجام ویزیت", "نرخ تبدیل", "سال", "ماه",
    ]
    for i, h in enumerate(headers, 1):
        header_cell(ws, 3, i, h)
    ws.row_dimensions[3].height = 28
    ws.freeze_panes = "A4"
    ws.auto_filter.ref = f"A3:P{LAST}"

    for r in range(4, LAST + 1):
        formula_cell(ws, r, 1, f'=IF(B{r}="","",ROW()-3)', "0")
        input_cell(ws, r, 2)
        input_cell(ws, r, 3)
        input_cell(ws, r, 4, fmt="#,##0")
        input_cell(ws, r, 5, fmt="#,##0")
        input_cell(ws, r, 6, fmt="#,##0")
        input_cell(ws, r, 7, fmt="#,##0")
        input_cell(ws, r, 8, fmt="#,##0")
        input_cell(ws, r, 9, fmt="#,##0")
        input_cell(ws, r, 10, fmt="#,##0")
        input_cell(ws, r, 11, fmt="#,##0")
        input_cell(ws, r, 12)
        formula_cell(ws, r, 13, f'=IF(OR(D{r}="",D{r}=0),"",E{r}/D{r})', "0.0%")
        formula_cell(ws, r, 14, f'=IF(OR(E{r}="",E{r}=0),"",F{r}/E{r})', "0.0%")
        formula_cell(ws, r, 15, f'={year_f(f"B{r}")}', "0")
        formula_cell(ws, r, 16, f'={month_f(f"B{r}")}', "0")
        ws.row_dimensions[r].height = 20

    for i, v in enumerate(VISITS):
        r = 4 + i
        ws.cell(r, 2).value = v[0]
        ws.cell(r, 3).value = v[1]
        ws.cell(r, 4).value = v[2]
        ws.cell(r, 5).value = v[3]
        ws.cell(r, 6).value = v[4]
        ws.cell(r, 7).value = v[5]
        ws.cell(r, 8).value = v[6]
        ws.cell(r, 9).value = v[7]
        ws.cell(r, 10).value = v[8]
        ws.cell(r, 11).value = v[9]
        ws.cell(r, 12).value = v[10]

    dv = DataValidation(type="custom", formula1='AND(LEN(B4)=10,MID(B4,5,1)="/",MID(B4,8,1)="/")', allow_blank=True)
    dv.add(f"B4:B{LAST}")
    ws.add_data_validation(dv)
    dv_list(ws, "=RegionList", f"C4:C{LAST}")

    ws.conditional_formatting.add(
        f"M4:M{LAST}",
        CellIsRule(operator="lessThan", formula=["0.6"], fill=FILL_R),
    )
    ws.conditional_formatting.add(
        f"M4:M{LAST}",
        CellIsRule(operator="between", formula=["0.6", "0.8"], fill=FILL_Y),
    )
    ws.conditional_formatting.add(
        f"M4:M{LAST}",
        CellIsRule(operator="greaterThanOrEqual", formula=["0.8"], fill=FILL_G),
    )

    set_col_widths(ws, {
        "A": 8, "B": 14, "C": 16, "D": 16, "E": 12, "F": 16, "G": 14,
        "H": 12, "I": 16, "J": 10, "K": 12, "L": 28, "M": 16, "N": 12,
        "O": 8, "P": 8,
    })
    add_table(ws, "SalesRepTbl", f"A3:P{LAST}")
    protect(ws)
    return ws


def build_expenses(wb: Workbook):
    ws = wb.create_sheet("Expenses")
    apply_rtl(ws)
    journal_title(ws, "هزینه‌ها", "هر هزینه یک ردیف. حقوق ماهانه را اول ماه بزنید. سوخت ماشین پخش جدا از برگه ویزیتور هم اینجا جمع می‌شود اگر وارد کنید.")
    headers = ["ردیف", "تاریخ شمسی", "نوع هزینه", "مبلغ (تومان)", "پرداخت‌کننده", "روش پرداخت", "توضیحات", "سال", "ماه"]
    for i, h in enumerate(headers, 1):
        header_cell(ws, 3, i, h)
    ws.row_dimensions[3].height = 28
    ws.freeze_panes = "A4"
    ws.auto_filter.ref = f"A3:I{LAST}"

    for r in range(4, LAST + 1):
        formula_cell(ws, r, 1, f'=IF(B{r}="","",ROW()-3)', "0")
        input_cell(ws, r, 2)
        input_cell(ws, r, 3)
        input_cell(ws, r, 4, fmt="#,##0")
        input_cell(ws, r, 5)
        input_cell(ws, r, 6)
        input_cell(ws, r, 7)
        formula_cell(ws, r, 8, f'={year_f(f"B{r}")}', "0")
        formula_cell(ws, r, 9, f'={month_f(f"B{r}")}', "0")

    for i, e in enumerate(EXPENSES):
        r = 4 + i
        ws.cell(r, 2).value = e[0]
        ws.cell(r, 3).value = e[1]
        ws.cell(r, 4).value = e[2]
        ws.cell(r, 5).value = e[3]
        ws.cell(r, 6).value = e[4]
        ws.cell(r, 7).value = e[5]

    dv = DataValidation(type="custom", formula1='AND(LEN(B4)=10,MID(B4,5,1)="/",MID(B4,8,1)="/")', allow_blank=True)
    dv.add(f"B4:B{LAST}")
    ws.add_data_validation(dv)
    dv_list(ws, "=ExpenseList", f"C4:C{LAST}")
    dv_list(ws, "=StaffList", f"E4:E{LAST}")
    dv_list(ws, "=PayList", f"F4:F{LAST}")

    set_col_widths(ws, {"A": 8, "B": 14, "C": 14, "D": 16, "E": 16, "F": 14, "G": 32, "H": 8, "I": 8})
    add_table(ws, "ExpensesTbl", f"A3:I{LAST}")
    protect(ws)
    return ws


def build_suppliers(wb: Workbook):
    ws = wb.create_sheet("Suppliers")
    apply_rtl(ws)
    journal_title(ws, "بانک تأمین‌کنندگان", "امتیاز کل میانگین ۵ معیار ۱ تا ۱۰ است. از همین فهرست در برگه خرید نام تأمین‌کننده انتخاب می‌شود.")
    headers = [
        "نام", "شماره تماس", "شهر", "نوع محصول", "قیمت شاخص (کیلو)",
        "کیفیت", "شرایط پرداخت", "زمان تحویل (روز)",
        "امتیاز قیمت", "امتیاز کیفیت", "امتیاز تحویل", "امتیاز ثبات", "امتیاز پرداخت",
        "امتیاز کل", "وضعیت تأیید", "توضیحات",
    ]
    for i, h in enumerate(headers, 1):
        header_cell(ws, 3, i, h)
    ws.row_dimensions[3].height = 28
    ws.freeze_panes = "A4"
    ws.auto_filter.ref = f"A3:P{LAST}"

    for r in range(4, LAST + 1):
        input_cell(ws, r, 1)
        input_cell(ws, r, 2)
        input_cell(ws, r, 3)
        input_cell(ws, r, 4)
        input_cell(ws, r, 5, fmt="#,##0")
        input_cell(ws, r, 6)
        input_cell(ws, r, 7)
        input_cell(ws, r, 8, fmt="0")
        for col in range(9, 14):
            input_cell(ws, r, col, fmt="0")
        formula_cell(
            ws, r, 14,
            f'=IF(A{r}="","",IF(COUNT(I{r}:M{r})=0,"",AVERAGE(I{r}:M{r})))',
            "0.0",
        )
        input_cell(ws, r, 15)
        input_cell(ws, r, 16)

    for i, s in enumerate(SUPPLIERS):
        r = 4 + i
        ws.cell(r, 1).value = s[0]
        ws.cell(r, 2).value = s[1]
        ws.cell(r, 3).value = s[2]
        ws.cell(r, 4).value = s[3]
        ws.cell(r, 5).value = s[4]
        ws.cell(r, 6).value = s[5]
        ws.cell(r, 7).value = s[6]
        ws.cell(r, 8).value = s[7]
        ws.cell(r, 9).value = s[8]
        ws.cell(r, 10).value = s[9]
        ws.cell(r, 11).value = s[10]
        ws.cell(r, 12).value = s[11]
        ws.cell(r, 13).value = s[12]
        ws.cell(r, 15).value = s[13]
        ws.cell(r, 16).value = s[14]

    dv_list(ws, "=CityList", f"C4:C{LAST}")
    dv_list(ws, "=ProductsList", f"D4:D{LAST}")
    dv_list(ws, "=QualityList", f"F4:F{LAST}")
    dv_list(ws, "=ApprovalList", f"O4:O{LAST}")
    for col in "IJKLM":
        dv = DataValidation(type="whole", operator="between", formula1="1", formula2="10", allow_blank=True)
        dv.error = "امتیاز ۱ تا ۱۰"
        dv.add(f"{col}4:{col}{LAST}")
        ws.add_data_validation(dv)

    ws.conditional_formatting.add(
        f"N4:N{LAST}",
        CellIsRule(operator="greaterThanOrEqual", formula=["8"], fill=FILL_G),
    )
    ws.conditional_formatting.add(
        f"N4:N{LAST}",
        CellIsRule(operator="between", formula=["6", "7.99"], fill=FILL_Y),
    )
    ws.conditional_formatting.add(
        f"N4:N{LAST}",
        CellIsRule(operator="lessThan", formula=["6"], fill=FILL_R),
    )

    set_col_widths(ws, {
        "A": 26, "B": 16, "C": 12, "D": 14, "E": 16, "F": 10, "G": 16, "H": 16,
        "I": 12, "J": 12, "K": 12, "L": 12, "M": 14, "N": 12, "O": 14, "P": 28,
    })
    add_table(ws, "SuppliersTbl", f"A3:P{LAST}")
    protect(ws)
    return ws


def build_employees(wb: Workbook):
    ws = wb.create_sheet("Employees")
    apply_rtl(ws)
    journal_title(ws, "کارکنان", "تا ۲۰ نفر جا دارد. پورسانت ماه از فروش همان فروشنده در ماه جاری × نرخ پورسانت حساب می‌شود.")
    headers = [
        "نام", "سمت", "وظایف", "حقوق ثابت (تومان)", "نرخ پورسانت",
        "پورسانت این ماه", "جمع دریافتی ماه", "تاریخ شروع", "وضعیت همکاری", "توضیحات",
    ]
    for i, h in enumerate(headers, 1):
        header_cell(ws, 3, i, h)
    ws.row_dimensions[3].height = 28
    ws.freeze_panes = "A4"

    for r in range(4, 24):
        input_cell(ws, r, 1)
        input_cell(ws, r, 2)
        input_cell(ws, r, 3, align=C_CTR)
        input_cell(ws, r, 4, fmt="#,##0")
        input_cell(ws, r, 5, fmt="0.0%")
        formula_cell(
            ws, r, 6,
            f'=IF(A{r}="","",SUMIFS(Sales!$L$4:$L${LAST},Sales!$O$4:$O${LAST},A{r},Sales!$P$4:$P${LAST},تنظیمات!$B$2,Sales!$Q$4:$Q${LAST},تنظیمات!$D$2)*IF(E{r}="",0,E{r}))',
            "#,##0",
        )
        formula_cell(ws, r, 7, f'=IF(A{r}="","",IF(D{r}="",0,D{r})+F{r})', "#,##0")
        input_cell(ws, r, 8)
        input_cell(ws, r, 9)
        input_cell(ws, r, 10)
        ws.row_dimensions[r].height = 28

    for i, e in enumerate(EMPLOYEES):
        r = 4 + i
        ws.cell(r, 1).value = e[0]
        ws.cell(r, 2).value = e[1]
        ws.cell(r, 3).value = e[2]
        ws.cell(r, 4).value = e[3]
        ws.cell(r, 5).value = e[4]
        ws.cell(r, 8).value = e[5]
        ws.cell(r, 9).value = e[6]
        ws.cell(r, 10).value = e[7]

    dv_list(ws, "=RoleList", "B4:B23")
    dv_list(ws, "=EmpStatusList", "I4:I23")

    set_col_widths(ws, {
        "A": 20, "B": 16, "C": 48, "D": 18, "E": 14, "F": 18, "G": 18, "H": 14, "I": 16, "J": 40,
    })
    protect(ws)
    return ws


def build_inventory(wb: Workbook):
    ws = wb.create_sheet("Inventory")
    apply_rtl(ws)
    ws.merge_cells("A1:H1")
    c = ws["A1"]
    c.value = "موجودی — خلاصه خودکار از خرید / تولید / فروش + دفتر تعدیل"
    c.font = F_TITLE
    c.fill = FILL_OLIVE
    c.alignment = C_CTR
    c.protection = PROT_LOCK
    ws.row_dimensions[1].height = 28
    ws.merge_cells("A2:H2")
    ws["A2"].value = "این برگه را پدر/مسئول انبار می‌بیند. خرید و فروش را دوباره وارد نکنید — خودکار حساب می‌شود. فقط شمارش و ضایعات انبار را پایین بزنید."
    ws["A2"].font = F_MUTED
    ws["A2"].fill = FILL_CREAM
    ws["A2"].alignment = C_CTR

    # ---- Summary
    ws.merge_cells("A3:H3")
    header_cell(ws, 3, 1, "الف) خلاصه موجودی لحظه‌ای")
    for col in range(2, 9):
        header_cell(ws, 3, col, "")

    heads = ["نوع موجودی", "محصول", "موجودی محاسبه‌شده", "واحد", "حداقل", "وضعیت", "محل نگهداری", "نکته"]
    for i, h in enumerate(heads, 1):
        header_cell(ws, 4, i, h)

    # Raw materials rows 5-11
    for i, p in enumerate(PRODUCTS):
        r = 5 + i
        label_cell(ws, r, 1, "مواد اولیه", fill=FILL_SEC)
        label_cell(ws, r, 2, p, fill=FILL_SEC)
        # purchases approved - production input + moves in - moves out
        formula_cell(
            ws, r, 3,
            (
                f'=SUMIFS(Purchases!$E$4:$E${LAST},Purchases!$D$4:$D${LAST},B{r},Purchases!$K$4:$K${LAST},"تأیید شده")'
                f'-SUMIFS(Production!$D$4:$D${LAST},Production!$C$4:$C${LAST},B{r})'
                f'+SUMIFS($D$30:$D$80,$C$30:$C$80,B{r},$B$30:$B$80,A{r})'
                f'-SUMIFS($E$30:$E$80,$C$30:$C$80,B{r},$B$30:$B$80,A{r})'
            ),
            "#,##0.00",
        )
        label_cell(ws, r, 4, "کیلوگرم", fill=FILL_FO)
        formula_cell(ws, r, 5, "=تنظیمات!$B$12/7", "0.00")  # split min roughly — better use settings min as total
        # Use a per-product min of 20 kg default, unlocked
        ws.cell(r, 5).value = 25
        ws.cell(r, 5).fill = FILL_IN
        ws.cell(r, 5).protection = PROT_OPEN
        ws.cell(r, 5).number_format = "0.00"
        ws.cell(r, 5).font = F_CELL
        ws.cell(r, 5).alignment = C_CTR
        ws.cell(r, 5).border = THIN
        formula_cell(
            ws, r, 6,
            f'=IF(C{r}="","—",IF(C{r}>=E{r},"مطلوب",IF(C{r}>=E{r}*0.4,"نیاز به بررسی","بحرانی")))',
        )
        label_cell(ws, r, 7, "انبار مواد اولیه", fill=FILL_FO)
        formula_cell(ws, r, 8, f'=IF(C{r}<0,"خطا: خروجی بیشتر از ورودی","")')

    # Finished goods rows 13-19
    ws.merge_cells("A12:H12")
    header_cell(ws, 12, 1, "محصول نهایی (کیلو — از مقدار پاک‌شده منهای فروش)")
    for col in range(2, 9):
        header_cell(ws, 12, col, "")

    for i, h in enumerate(heads, 1):
        header_cell(ws, 13, i, h)

    for i, p in enumerate(PRODUCTS):
        r = 14 + i
        label_cell(ws, r, 1, "محصول نهایی", fill=FILL_SEC)
        label_cell(ws, r, 2, p, fill=FILL_SEC)
        formula_cell(
            ws, r, 3,
            (
                f'=SUMIFS(Production!$E$4:$E${LAST},Production!$C$4:$C${LAST},B{r})'
                f'-SUMIFS(Sales!$H$4:$H${LAST},Sales!$E$4:$E${LAST},B{r})'
                f'+SUMIFS($D$30:$D$80,$C$30:$C$80,B{r},$B$30:$B$80,A{r})'
                f'-SUMIFS($E$30:$E$80,$C$30:$C$80,B{r},$B$30:$B$80,A{r})'
            ),
            "#,##0.00",
        )
        label_cell(ws, r, 4, "کیلوگرم", fill=FILL_FO)
        cell = input_cell(ws, r, 5, 15, fmt="0.00")
        formula_cell(
            ws, r, 6,
            f'=IF(C{r}="","—",IF(C{r}>=E{r},"مطلوب",IF(C{r}>=E{r}*0.4,"نیاز به بررسی","بحرانی")))',
        )
        label_cell(ws, r, 7, "انبار محصول نهایی", fill=FILL_FO)
        formula_cell(ws, r, 8, f'=IF(C{r}<0,"خطا: فروش بیشتر از تولید","")')

    status_cf(ws, "F5:F11")
    status_cf(ws, "F14:F20")

    # Totals
    label_cell(ws, 21, 1, "جمع مواد اولیه", fill=FILL_H, font=F_TH)
    formula_cell(ws, 21, 3, "=SUM(C5:C11)", "#,##0.00")
    ws["C21"].fill = FILL_H
    ws["C21"].font = F_TH
    label_cell(ws, 22, 1, "جمع محصول نهایی", fill=FILL_H, font=F_TH)
    formula_cell(ws, 22, 3, "=SUM(C14:C20)", "#,##0.00")
    ws["C22"].fill = FILL_H
    ws["C22"].font = F_TH

    # Pack breakdown
    ws.merge_cells("A24:H24")
    header_cell(ws, 24, 1, "ب) موجودی بسته (تعداد بسته تولیدشده − تعداد فروش)")
    for col in range(2, 9):
        header_cell(ws, 24, col, "")
    for i, h in enumerate(["محصول", "وزن بسته", "تولید بسته", "فروش بسته", "مانده بسته", "واحد", "", ""], 1):
        header_cell(ws, 25, i, h)

    row = 26
    for p in PRODUCTS:
        for pack in PACKS:
            label_cell(ws, row, 1, p, fill=FILL_SEC)
            label_cell(ws, row, 2, pack, fill=FILL_SEC)
            ws.cell(row, 2).number_format = "0.00"
            formula_cell(
                ws, row, 3,
                f'=SUMIFS(Production!$I$4:$I${LAST},Production!$C$4:$C${LAST},A{row},Production!$H$4:$H${LAST},B{row})',
                "#,##0",
            )
            formula_cell(
                ws, row, 4,
                f'=SUMIFS(Sales!$G$4:$G${LAST},Sales!$E$4:$E${LAST},A{row},Sales!$F$4:$F${LAST},B{row})',
                "#,##0",
            )
            formula_cell(ws, row, 5, f"=C{row}-D{row}", "#,##0")
            label_cell(ws, row, 6, "بسته", fill=FILL_FO)
            row += 1
    pack_end = row - 1

    # Movement log starts at row 30 (leave a gap — pack table may go to 26+21=47!). 
    # 7 products * 3 packs = 21 rows → 26 to 46. Start moves at 49.

    move_start = 49
    ws.merge_cells(start_row=move_start - 2, start_column=1, end_row=move_start - 2, end_column=8)
    header_cell(ws, move_start - 2, 1, "ج) دفتر حرکات دستی انبار (شمارش، ضایعات انبار، اصلاح)")
    for col in range(2, 9):
        header_cell(ws, move_start - 2, col, "")
    ws.merge_cells(start_row=move_start - 1, start_column=1, end_row=move_start - 1, end_column=8)
    ws.cell(move_start - 1, 1, "خرید و فروش را اینجا ننویسید. فقط وقتی شمارش با سیستم فرق دارد یا ضایعات انبار رخ داده.")
    ws.cell(move_start - 1, 1).font = F_MUTED
    ws.cell(move_start - 1, 1).fill = FILL_CREAM

    move_heads = ["تاریخ شمسی", "نوع موجودی", "محصول", "ورود", "خروج", "موجودی این کالا (دفتر)", "واحد", "محل / علت"]
    for i, h in enumerate(move_heads, 1):
        header_cell(ws, move_start, i, h)

    move_last = move_start + 40
    for r in range(move_start + 1, move_last + 1):
        input_cell(ws, r, 1)
        input_cell(ws, r, 2)
        input_cell(ws, r, 3)
        input_cell(ws, r, 4, fmt="#,##0.00")
        input_cell(ws, r, 5, fmt="#,##0.00")
        formula_cell(
            ws, r, 6,
            (
                f'=IF(C{r}="","",'
                f'SUMIFS($D${move_start+1}:D{r},$C${move_start+1}:C{r},C{r},$B${move_start+1}:B{r},B{r})'
                f'-SUMIFS($E${move_start+1}:E{r},$C${move_start+1}:C{r},C{r},$B${move_start+1}:B{r},B{r}))'
            ),
            "#,##0.00",
        )
        input_cell(ws, r, 7)
        input_cell(ws, r, 8)

    # sample moves
    for i, m in enumerate(INV_MOVES):
        r = move_start + 1 + i
        ws.cell(r, 1).value = m[0]
        ws.cell(r, 2).value = m[1]
        ws.cell(r, 3).value = m[2]
        ws.cell(r, 4).value = m[3]
        ws.cell(r, 5).value = m[4]
        ws.cell(r, 7).value = m[5]
        ws.cell(r, 8).value = f"{m[6]} — {m[7]}"

    # FIX summary formulas to use actual move range 50:90 not 30:80
    for r in list(range(5, 12)) + list(range(14, 21)):
        kind = "A{r}"
        prod = "B{r}"
        if r <= 11:
            ws.cell(r, 3).value = (
                f'=SUMIFS(Purchases!$E$4:$E${LAST},Purchases!$D$4:$D${LAST},B{r},Purchases!$K$4:$K${LAST},"تأیید شده")'
                f'-SUMIFS(Production!$D$4:$D${LAST},Production!$C$4:$C${LAST},B{r})'
                f'+SUMIFS($D$50:$D$90,$C$50:$C$90,B{r},$B$50:$B$90,A{r})'
                f'-SUMIFS($E$50:$E$90,$C$50:$C$90,B{r},$B$50:$B$90,A{r})'
            )
        else:
            ws.cell(r, 3).value = (
                f'=SUMIFS(Production!$E$4:$E${LAST},Production!$C$4:$C${LAST},B{r})'
                f'-SUMIFS(Sales!$H$4:$H${LAST},Sales!$E$4:$E${LAST},B{r})'
                f'+SUMIFS($D$50:$D$90,$C$50:$C$90,B{r},$B$50:$B$90,A{r})'
                f'-SUMIFS($E$50:$E$90,$C$50:$C$90,B{r},$B$50:$B$90,A{r})'
            )

    dv = DataValidation(type="custom", formula1='AND(LEN(A50)=10,MID(A50,5,1)="/",MID(A50,8,1)="/")', allow_blank=True)
    dv.add(f"A50:A{move_last}")
    ws.add_data_validation(dv)
    dv_list(ws, "=InvKindList", f"B50:B{move_last}")
    dv_list(ws, "=ProductsList", f"C50:C{move_last}")
    dv_list(ws, "=UnitList", f"G50:G{move_last}")

    set_col_widths(ws, {"A": 18, "B": 16, "C": 22, "D": 16, "E": 14, "F": 18, "G": 16, "H": 36})
    ws.freeze_panes = "A5"
    ws.row_dimensions[2].height = 22
    protect(ws)
    return ws


def build_report(wb: Workbook):
    """Pivot-like monthly operations report (reliable formulas, not XML pivot)."""
    ws = wb.create_sheet("گزارش")
    apply_rtl(ws)
    ws.merge_cells("A1:J1")
    c = ws["A1"]
    c.value = "گزارش ماهانه محصول — معادل جدول محوری (Pivot). با تغییر ماه در تنظیمات به‌روز می‌شود."
    c.font = F_TITLE
    c.fill = FILL_OLIVE
    c.alignment = C_CTR
    ws.row_dimensions[1].height = 30
    ws.merge_cells("A2:J2")
    ws["A2"].value = '=CONCATENATE("دوره: ",تنظیمات!B2," / ","ماه ",تنظیمات!D2,"  —  ","اگر خواستید Pivot واقعی بسازید: از جدول SalesTbl برگه Sales، Insert > PivotTable")'
    ws["A2"].font = F_MUTED
    ws["A2"].fill = FILL_CREAM
    ws["A2"].alignment = C_CTR

    heads = [
        "محصول", "خرید تأییدشده (کیلو)", "میانگین قیمت تمام‌شده", "تولید پاک‌شده (کیلو)",
        "ضایعات (کیلو)", "درصد ضایعات", "فروش (کیلو)", "فروش (تومان)",
        "موجودی مواد", "موجودی محصول",
    ]
    for i, h in enumerate(heads, 1):
        header_cell(ws, 4, i, h)
    ws.row_dimensions[4].height = 30

    for i, p in enumerate(PRODUCTS):
        r = 5 + i
        label_cell(ws, r, 1, p, fill=FILL_SEC)
        formula_cell(
            ws, r, 2,
            f'=SUMIFS(Purchases!$E$4:$E${LAST},Purchases!$D$4:$D${LAST},A{r},Purchases!$K$4:$K${LAST},"تأیید شده",Purchases!$M$4:$M${LAST},تنظیمات!$B$2,Purchases!$N$4:$N${LAST},تنظیمات!$D$2)',
            "#,##0.00",
        )
        formula_cell(
            ws, r, 3,
            f'=IFERROR(SUMIFS(Purchases!$G$4:$G${LAST},Purchases!$D$4:$D${LAST},A{r},Purchases!$K$4:$K${LAST},"تأیید شده",Purchases!$M$4:$M${LAST},تنظیمات!$B$2,Purchases!$N$4:$N${LAST},تنظیمات!$D$2)/B{r}+SUMIFS(Purchases!$H$4:$H${LAST},Purchases!$D$4:$D${LAST},A{r},Purchases!$K$4:$K${LAST},"تأیید شده",Purchases!$M$4:$M${LAST},تنظیمات!$B$2,Purchases!$N$4:$N${LAST},تنظیمات!$D$2)/B{r},0)',
            "#,##0",
        )
        formula_cell(
            ws, r, 4,
            f'=SUMIFS(Production!$E$4:$E${LAST},Production!$C$4:$C${LAST},A{r},Production!$M$4:$M${LAST},تنظیمات!$B$2,Production!$N$4:$N${LAST},تنظیمات!$D$2)',
            "#,##0.00",
        )
        formula_cell(
            ws, r, 5,
            f'=SUMIFS(Production!$F$4:$F${LAST},Production!$C$4:$C${LAST},A{r},Production!$M$4:$M${LAST},تنظیمات!$B$2,Production!$N$4:$N${LAST},تنظیمات!$D$2)',
            "#,##0.00",
        )
        formula_cell(ws, r, 6, f'=IF(D{r}=0,"",E{r}/(D{r}+E{r}))', "0.0%")
        formula_cell(
            ws, r, 7,
            f'=SUMIFS(Sales!$H$4:$H${LAST},Sales!$E$4:$E${LAST},A{r},Sales!$P$4:$P${LAST},تنظیمات!$B$2,Sales!$Q$4:$Q${LAST},تنظیمات!$D$2)',
            "#,##0.00",
        )
        formula_cell(
            ws, r, 8,
            f'=SUMIFS(Sales!$L$4:$L${LAST},Sales!$E$4:$E${LAST},A{r},Sales!$P$4:$P${LAST},تنظیمات!$B$2,Sales!$Q$4:$Q${LAST},تنظیمات!$D$2)',
            "#,##0",
        )
        formula_cell(ws, r, 9, f'=SUMIF(Inventory!$B$5:$B$11,A{r},Inventory!$C$5:$C$11)', "#,##0.00")
        formula_cell(ws, r, 10, f'=SUMIF(Inventory!$B$14:$B$20,A{r},Inventory!$C$14:$C$20)', "#,##0.00")
        ws.row_dimensions[r].height = 22

    r = 12
    label_cell(ws, r, 1, "جمع", fill=FILL_H, font=F_TH)
    for col, fmt in [(2, "#,##0.00"), (4, "#,##0.00"), (5, "#,##0.00"), (7, "#,##0.00"), (8, "#,##0"), (9, "#,##0.00"), (10, "#,##0.00")]:
        formula_cell(ws, r, col, f"=SUM({get_column_letter(col)}5:{get_column_letter(col)}11)", fmt)
        ws.cell(r, col).fill = FILL_H
        ws.cell(r, col).font = F_TH
    formula_cell(ws, r, 6, "=IF(D12=0,\"\",E12/(D12+E12))", "0.0%")
    ws.cell(r, 6).fill = FILL_H
    ws.cell(r, 6).font = F_TH

    ws.conditional_formatting.add("F5:F11", CellIsRule(operator="greaterThan", formula=["0.06"], fill=FILL_R))
    ws.conditional_formatting.add("F5:F11", CellIsRule(operator="lessThan", formula=["0.03"], fill=FILL_G))

    set_col_widths(ws, {get_column_letter(i): 18 for i in range(1, 11)})
    ws.column_dimensions["A"].width = 16
    ws.column_dimensions["C"].width = 22
    protect(ws)
    return ws


def build_dashboard(wb: Workbook):
    ws = wb.create_sheet("Dashboard", 0)
    apply_rtl(ws)
    ws.sheet_view.showGridLines = False
    ws.sheet_properties.tabColor = "1F3D2B"

    # Banner
    ws.merge_cells("A1:G1")
    c = ws["A1"]
    c.value = '=تنظیمات!B8'
    c.font = F_TITLE
    c.fill = FILL_OLIVE
    c.alignment = C_CTR
    c.protection = PROT_LOCK
    ws.row_dimensions[1].height = 34

    ws.merge_cells("A2:G2")
    ws["A2"].value = (
        '=CONCATENATE("داشبورد مدیریتی  |  ","سال ",تنظیمات!B2,"  —  ماه ",تنظیمات!D2,'
        '"  |  تاریخ امروز: ",تنظیمات!F2,"  |  اگر چراغی قرمز نیست، دخالت لازم نیست")'
    )
    ws["A2"].font = Font(name="Tahoma", size=9, color=WHITE)
    ws["A2"].fill = PatternFill("solid", fgColor=OLIVE2)
    ws["A2"].alignment = C_CTR
    ws["A2"].protection = PROT_LOCK
    ws.row_dimensions[2].height = 22

    # Overall health
    ws.merge_cells("A3:G3")
    # Count reds from status column E of KPI block (rows 7-22)
    ws["A3"].value = (
        '=IF(COUNTIF(E7:E22,"بحرانی")>0,CONCATENATE(COUNTIF(E7:E22,"بحرانی")," شاخص بحرانی — امروز اقدام کنید"),'
        'IF(COUNTIF(E7:E22,"نیاز به بررسی")>0,CONCATENATE(COUNTIF(E7:E22,"نیاز به بررسی")," شاخص نیاز به بررسی دارد"),'
        '"همه شاخص‌های مهم مطلوب‌اند. کارگاه روی روال است."))'
    )
    ws["A3"].font = Font(name="Tahoma", size=12, bold=True, color=INK)
    ws["A3"].alignment = C_CTR
    ws["A3"].fill = FILL_CREAM
    ws["A3"].protection = PROT_LOCK
    ws.row_dimensions[3].height = 26
    ws.conditional_formatting.add(
        "A3:G3",
        FormulaRule(formula=['COUNTIF(E7:E22,"بحرانی")>0'], fill=FILL_R, font=Font(name="Tahoma", size=12, bold=True, color=RED_FG)),
    )
    ws.conditional_formatting.add(
        "A3:G3",
        FormulaRule(
            formula=['AND(COUNTIF(E7:E22,"بحرانی")=0,COUNTIF(E7:E22,"نیاز به بررسی")>0)'],
            fill=FILL_Y,
            font=Font(name="Tahoma", size=12, bold=True, color=YELLOW_FG),
        ),
    )
    ws.conditional_formatting.add(
        "A3:G3",
        FormulaRule(
            formula=['AND(COUNTIF(E7:E22,"بحرانی")=0,COUNTIF(E7:E22,"نیاز به بررسی")=0)'],
            fill=FILL_G,
            font=Font(name="Tahoma", size=12, bold=True, color=GREEN_FG),
        ),
    )

    heads = ["شاخص", "مقدار", "واحد", "هدف", "وضعیت", "اقدام اصلاحی"]
    for i, h in enumerate(heads, 1):
        header_cell(ws, 5, i, h)
    ws.merge_cells("F5:G5")
    header_cell(ws, 5, 7, "")
    ws.row_dimensions[5].height = 24

    # Helper lambdas for monthly SUMIFS
    def msum(sheet, val, ycol, mcol):
        return (
            f"SUMIFS({sheet}!${val}$4:${val}${LAST},{sheet}!${ycol}$4:${ycol}${LAST},تنظیمات!$B$2,"
            f"{sheet}!${mcol}$4:${mcol}${LAST},تنظیمات!$D$2)"
        )

    def msumifs2(sheet, val, ycol, mcol, extra_col, extra_val):
        return (
            f"SUMIFS({sheet}!${val}$4:${val}${LAST},{sheet}!${ycol}$4:${ycol}${LAST},تنظیمات!$B$2,"
            f"{sheet}!${mcol}$4:${mcol}${LAST},تنظیمات!$D$2,{sheet}!${extra_col}$4:${extra_col}${LAST},{extra_val})"
        )

    def mcount(sheet, datecol, ycol, mcol):
        return (
            f'COUNTIFS({sheet}!${ycol}$4:${ycol}${LAST},تنظیمات!$B$2,{sheet}!${mcol}$4:${mcol}${LAST},تنظیمات!$D$2,{sheet}!${datecol}$4:${datecol}${LAST},"<>")'
        )

    # KPI formulas (value in col B). Settings KPI table starts row 18.
    # Mapping: Dashboard row -> Settings row for target
    # 7 sales_day Settings 18
    # 8 sales_month 19
    # 9 gross_profit 20
    # 10 purchases 21  info
    # 11 raw_stock 22
    # 12 fin_stock 23
    # 13 production 24
    # 14 waste 25
    # 15 orders 26
    # 16 new_cust 27
    # 17 collected 28
    # 18 receivables 29
    # 19 expenses 30
    # 20 visit_rate 31
    # 21 conversion 32
    # 22 accept_rate 33

    sales_month = msum("Sales", "L", "P", "Q")
    purch_month = (
        f'SUMIFS(Purchases!$G$4:$G${LAST},Purchases!$M$4:$M${LAST},تنظیمات!$B$2,Purchases!$N$4:$N${LAST},تنظیمات!$D$2,Purchases!$K$4:$K${LAST},"تأیید شده")'
        f'+SUMIFS(Purchases!$H$4:$H${LAST},Purchases!$M$4:$M${LAST},تنظیمات!$B$2,Purchases!$N$4:$N${LAST},تنظیمات!$D$2,Purchases!$K$4:$K${LAST},"تأیید شده")'
    )
    exp_month = msum("Expenses", "D", "H", "I")
    # plus visit fuel already in expenses sample; don't double count unless they enter both

    kpi_defs = [
        # row, name, value formula, unit, settings_row, direction, number format
        (7, "فروش روزانه", 'SUMIF(Sales!$B$4:$B$151,تنظیمات!$F$2,Sales!$L$4:$L$151)', "تومان", 18, "higher", "#,##0"),
        (8, "فروش ماهانه", sales_month, "تومان", 19, "higher", "#,##0"),
        (9, "سود ناخالص", f"({sales_month})-({purch_month})-({exp_month})", "تومان", 20, "higher", "#,##0"),
        (10, "خرید مواد اولیه", purch_month, "تومان", 21, "info", "#,##0"),
        (11, "موجودی مواد اولیه", "Inventory!C21", "کیلوگرم", 22, "higher", "#,##0.00"),
        (12, "موجودی محصول نهایی", "Inventory!C22", "کیلوگرم", 23, "higher", "#,##0.00"),
        (13, "مقدار تولید", msum("Production", "E", "M", "N"), "کیلوگرم", 24, "higher", "#,##0.00"),
        (14, "درصد ضایعات",
         f'IFERROR({msum("Production","F","M","N")}/{msum("Production","D","M","N")},0)',
         "درصد", 25, "lower", "0.0%"),
        (15, "تعداد سفارش‌ها", mcount("Sales", "B", "P", "Q"), "عدد", 26, "higher", "0"),
        (16, "مشتریان جدید",
         'COUNTIFS(Customers!$G$4:$G$151,">="&TEXT(تنظیمات!$B$2,"0")&"/"&TEXT(تنظیمات!$D$2,"00")&"/01",'
         'Customers!$G$4:$G$151,"<="&TEXT(تنظیمات!$B$2,"0")&"/"&TEXT(تنظیمات!$D$2,"00")&"/31")',
         "نفر", 27, "higher", "0"),
        (17, "مبلغ وصول‌شده", msum("Sales", "M", "P", "Q"), "تومان", 28, "higher", "#,##0"),
        (18, "مطالبات (مانده باز)", f"SUMIF(Sales!$N$4:$N${LAST},\">0\")", "تومان", 29, "lower", "#,##0"),
        (19, "هزینه‌ها", exp_month, "تومان", 30, "lower", "#,##0"),
        (20, "درصد انجام ویزیت",
         f'IFERROR({msum("SalesRep","E","O","P")}/{msum("SalesRep","D","O","P")},0)',
         "درصد", 31, "higher", "0.0%"),
        (21, "نرخ تبدیل ویزیت به سفارش",
         f'IFERROR({msum("SalesRep","F","O","P")}/{msum("SalesRep","E","O","P")},0)',
         "درصد", 32, "higher", "0.0%"),
        (22, "درصد بارهای قبول‌شده",
         f'IFERROR(COUNTIFS(Purchases!$M$4:$M${LAST},تنظیمات!$B$2,Purchases!$N$4:$N${LAST},تنظیمات!$D$2,Purchases!$K$4:$K${LAST},"تأیید شده")/'
         f'COUNTIFS(Purchases!$M$4:$M${LAST},تنظیمات!$B$2,Purchases!$N$4:$N${LAST},تنظیمات!$D$2,Purchases!$B$4:$B${LAST},"<>"),0)',
         "درصد", 33, "higher", "0.0%"),
    ]

    # Fix new customers: first purchase (col G) in current year/month
    # MINIFS returns text dates like 1405/06/09 — LEFT 7 chars = 1405/06
    kpi_defs[9] = (
        16, "مشتریان جدید",
        'SUMPRODUCT((Customers!$A$4:$A$151<>"")*(LEFT(Customers!$G$4:$G$151,7)=TEXT(تنظیمات!$B$2,"0")&"/"&IF(تنظیمات!$D$2<10,"0","")&TEXT(تنظیمات!$D$2,"0")))',
        "نفر", 27, "higher", "0",
    )

    for row, name, val, unit, srow, direction, fmt in kpi_defs:
        label_cell(ws, row, 1, name, fill=FILL_SEC, font=F_LABEL)
        formula_cell(ws, row, 2, f"={val}", fmt, align=C_CTR)
        ws.cell(row, 2).font = F_KPI
        label_cell(ws, row, 3, unit, fill=FILL_FO, font=F_SMALL)
        if direction == "info":
            label_cell(ws, row, 4, "—", fill=FILL_FO)
            formula_cell(ws, row, 5, '="—"')
            ws.merge_cells(start_row=row, start_column=6, end_row=row, end_column=7)
            formula_cell(ws, row, 6, '=""')
        else:
            formula_cell(ws, row, 4, f"=تنظیمات!C{srow}", fmt)
            formula_cell(
                ws, row, 5,
                f"={status_formula('B' + str(row), 'D' + str(row), 'تنظیمات!D' + str(srow), direction)}",
            )
            ws.merge_cells(start_row=row, start_column=6, end_row=row, end_column=7)
            formula_cell(
                ws, row, 6,
                f'=IF(E{row}="بحرانی",تنظیمات!G{srow},IF(E{row}="نیاز به بررسی","زیر نظر بگیرید — اگر تا پایان هفته سبز نشد اقدام کنید",IF(E{row}="مطلوب","","")))',
                align=C_CTR,
            )
        ws.row_dimensions[row].height = 26

    status_cf(ws, "E7:E22")

    # How-to strip
    ws.merge_cells("A23:G23")
    ws["A23"].value = "چرخه کار: ثبت در برگه‌ها → محاسبه خودکار KPI → نگاه ۱۰ دقیقه‌ای به این صفحه → فقط روی قرمز/زرد اقدام → اصلاح"
    ws["A23"].font = F_MUTED
    ws["A23"].fill = FILL_CREAM
    ws["A23"].alignment = C_CTR

    # Charts from Lists U/V
    pie = PieChart()
    pie.title = "ترکیب فروش ماه (تومان)"
    labels = Reference(wb["Lists"], min_col=21, min_row=2, max_row=8)
    data = Reference(wb["Lists"], min_col=22, min_row=1, max_row=8)
    pie.add_data(data, titles_from_data=True)
    pie.set_categories(labels)
    pie.dataLabels = DataLabelList()
    pie.dataLabels.showPercent = True
    pie.dataLabels.showVal = False
    pie.dataLabels.showCatName = False
    pie.width = 12
    pie.height = 8
    ws.add_chart(pie, "A25")

    bar = BarChart()
    bar.type = "col"
    bar.title = "تولید ماه به تفکیک محصول (کیلو)"
    data2 = Reference(wb["Lists"], min_col=23, min_row=1, max_row=8)
    bar.add_data(data2, titles_from_data=True)
    bar.set_categories(labels)
    bar.shape = 4
    bar.legend = None
    bar.width = 12
    bar.height = 8
    ws.add_chart(bar, "D25")

    # Mini legend
    ws.merge_cells("A41:G41")
    header_cell(ws, 41, 1, "راهنمای سریع رنگ‌ها")
    for col in range(2, 8):
        header_cell(ws, 41, col, "")
    ws.merge_cells("A42:B42")
    ws["A42"].value = "مطلوب — ادامه بده"
    ws["A42"].fill = FILL_G
    ws["A42"].font = Font(name="Tahoma", size=9, bold=True, color=GREEN_FG)
    ws["A42"].alignment = C_CTR
    ws.merge_cells("C42:E42")
    ws["C42"].value = "نیاز به بررسی — این هفته زیر نظر"
    ws["C42"].fill = FILL_Y
    ws["C42"].font = Font(name="Tahoma", size=9, bold=True, color=YELLOW_FG)
    ws["C42"].alignment = C_CTR
    ws.merge_cells("F42:G42")
    ws["F42"].value = "بحرانی — امروز اقدام"
    ws["F42"].fill = FILL_R
    ws["F42"].font = Font(name="Tahoma", size=9, bold=True, color=RED_FG)
    ws["F42"].alignment = C_CTR

    set_col_widths(ws, {"A": 26, "B": 18, "C": 12, "D": 16, "E": 16, "F": 28, "G": 36})
    ws.page_setup.orientation = "landscape"
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 1
    ws.print_area = "A1:G42"
    protect(ws)
    return ws


def build_guide(wb: Workbook):
    ws = wb.create_sheet("راهنما", 0)
    apply_rtl(ws)
    ws.merge_cells("A1:F1")
    c = ws["A1"]
    c.value = "راهنمای استفاده — کارگاه بسته‌بندی حبوبات پلدختر"
    c.font = F_TITLE
    c.fill = FILL_OLIVE
    c.alignment = C_CTR
    ws.row_dimensions[1].height = 34
    ws.merge_cells("A2:F2")
    ws["A2"].value = "هدف: مدیر در کمتر از ۱۰ دقیقه بفهمد چه چیزی خوب است، چه چیزی مشکل دارد، و کجا باید دخالت کند."
    ws["A2"].font = Font(name="Tahoma", size=10, italic=True, color=WHITE)
    ws["A2"].fill = PatternFill("solid", fgColor=OLIVE2)
    ws["A2"].alignment = C_CTR

    sections = []

    def sec(row, title):
        ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=6)
        header_cell(ws, row, 1, title)
        for col in range(2, 7):
            header_cell(ws, row, col, "")
        return row + 1

    def line(row, *vals):
        for i, v in enumerate(vals, 1):
            label_cell(ws, row, i, v, font=F_CELL, fill=FILL_W, align=C_CTR)
        ws.row_dimensions[row].height = 32
        return row + 1

    r = 4
    r = sec(r, "۱) هر کس چه چیزی را وارد می‌کند")
    for i, h in enumerate(["شخص", "وظیفه در کارگاه", "برگه Excel", "فرم کاغذی", "چه چیزی را می‌نویسد", "چه چیزی را دست نزند"], 1):
        header_cell(ws, r, i, h)
    r += 1
    rows_who = [
        ("مدیر / مالک", "خرید، فروش، مالی، تصمیم", "Purchases + تنظیمات + Dashboard", "تأیید خرید و هزینه",
         "تأیید بار، اهداف KPI، نگاه داشبورد", "ردیف‌های فرمول خاکستری"),
        ("پدر مدیر", "انبار و کمک تولید", "Inventory + کمک Production", "شمارش موجودی، دریافت مواد",
         "شمارش و تعدیل انبار", "خرید و فروش (تکراری نشود)"),
        ("نیروی خانم", "پاک‌کنی و بسته‌بندی", "Production (یا فقط فرم کاغذی)", "گزارش تولید روزانه",
         "مقدار ورودی، پاک‌شده، وزن بسته", "درصد ضایعات (خودکار است)"),
        ("ویزیتور آقا", "ویزیت، فروش، پخش", "Sales + SalesRep + Customers", "گزارش ویزیت، خروج کالا، تحویل پخش",
         "سفارش، وصول، مسیر، کیلومتر", "مانده حساب (خودکار است)"),
    ]
    for rowd in rows_who:
        r = line(r, *rowd)

    r += 1
    r = sec(r, "۲) روال روزانه مدیر (زیر ۱۰ دقیقه)")
    steps = [
        "۱. در برگه تنظیمات، «تاریخ امروز» و اگر ماه عوض شده «ماه جاری» را به‌روز کنید.",
        "۲. فرم‌های کاغذی دیروز را از روی میز جمع کنید و به مسئول مربوطه بدهید تا در Excel بزند (یا خودتان).",
        "۳. برگه Dashboard را باز کنید. نوار بالای جدول را بخوانید.",
        "۴. اگر همه چیز مطلوب است، صفحه را ببندید. نیازی به خواندن فرم‌ها نیست.",
        "۵. اگر زرد است: تا پایان هفته صبر و نظارت. اگر قرمز است: متن «اقدام اصلاحی» همان ردیف را همان روز اجرا کنید.",
        "۶. چرخه: ثبت → KPI → داشبورد → تشخیص انحراف → اقدام → بهبود هدف در تنظیمات اگر لازم شد.",
    ]
    for s in steps:
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=6)
        label_cell(ws, r, 1, s, font=F_CELL, fill=FILL_CREAM, align=C_CTR)
        ws.row_dimensions[r].height = 22
        r += 1

    r += 1
    r = sec(r, "۳) قوانین مهم")
    rules = [
        "تاریخ را همیشه با اعداد انگلیسی و صفر جلو ماه/روز بنویسید: 1405/06/18 نه ۱۴۰۵/۶/۱۸.",
        "سلول کرم‌رنگ = ورود اطلاعات. سلول خاکستری = فرمول. فرمول را پاک نکنید. اگر لازم شد از Review برگه را Unprotect کنید (رمز ندارد).",
        "هر داده فقط یک بار وارد می‌شود. خرید در Purchases، تولید در Production، فروش در Sales. موجودی خودش حساب می‌شود.",
        "فقط بار «تأیید شده» وارد موجودی و هزینه خرید می‌شود. بار ضعیف را «رد شده» بزنید.",
        "وزن بسته: 0.4 یعنی ۴۰۰ گرم، 0.9 یعنی ۹۰۰ گرم، 10 یعنی کیسه ۱۰ کیلویی.",
        "واحد پول همه جا تومان است. اعداد با جداکننده هزارگان نمایش داده می‌شوند.",
        "مشتری جدید = کسی که اولین خریدش در ماه جاری است (از روی برگه Sales).",
        "سود ناخالص این سامانه = فروش ماه − خرید تأییدشده ماه − هزینه‌های ماه. ساده و قابل فهم برای کارگاه کوچک.",
        "برای ماه بعد فقط سال/ماه را در تنظیمات عوض کنید. داده قبلی سر جایش می‌ماند.",
        "جا برای رشد تا حدود ۲۰ کارمند در برگه Employees آماده است. ردیف‌های خالی ژورنال تا ۱۵۰ تراکنش جا دارد.",
    ]
    for s in rules:
        ws.merge_cells(start_row=r, start_column=1, end_row=r, end_column=6)
        label_cell(ws, r, 1, s, font=F_CELL, align=C_CTR)
        ws.row_dimensions[r].height = 28
        r += 1

    r += 1
    r = sec(r, "۴) فهرست برگه‌ها")
    for i, h in enumerate(["برگه", "کاربرد", "چه کسی", "ورود یا خواندنی", "", ""], 1):
        header_cell(ws, r, i, h)
    r += 1
    sheets = [
        ("راهنما", "همین صفحه", "همه", "خواندنی"),
        ("Dashboard", "وضعیت کارگاه در یک نگاه", "مدیر", "خواندنی — خودکار"),
        ("تنظیمات", "سال/ماه/امروز و اهداف KPI", "مدیر", "ورود اهداف"),
        ("Purchases", "خرید مواد اولیه", "مدیر", "ورود"),
        ("Inventory", "موجودی لحظه‌ای + تعدیل", "پدر / مدیر", "عمدتاً خودکار"),
        ("Production", "تولید و ضایعات", "بسته‌بندی / پدر", "ورود"),
        ("Sales", "فاکتور فروش و وصول", "ویزیتور / مدیر", "ورود"),
        ("Customers", "دفتر مشتری و ABC", "ویزیتور / مدیر", "ورود مشخصات"),
        ("SalesRep", "عملکرد روزانه ویزیتور", "ویزیتور", "ورود"),
        ("Expenses", "هزینه‌ها", "مدیر / پدر", "ورود"),
        ("Suppliers", "بانک تأمین‌کننده و امتیاز", "مدیر", "ورود"),
        ("Employees", "کارکنان و حقوق و پورسانت", "مدیر", "ورود"),
        ("گزارش", "جدول ماهانه محصول (Pivot-like)", "مدیر", "خواندنی"),
        ("فرم‌ها", "۸ فرم A4 قابل چاپ", "کارگران", "چاپ؛ با خودکار پر می‌شود"),
    ]
    for s in sheets:
        r = line(r, s[0], s[1], s[2], s[3], "", "")

    r += 1
    r = sec(r, "۵) داده نمونه")
    ws.merge_cells(start_row=r, start_column=1, end_row=r + 2, end_column=6)
    txt = (
        "این فایل با داده نمونه شهریور ۱۴۰۵ پر شده تا داشبورد خالی نباشد و چراغ‌ها دیده شوند. "
        "قبل از استفاده واقعی: ردیف‌های نمونه را پاک کنید (محتوای سلول‌های کرم را خالی کنید، فرمول خاکستری را نزنید) "
        "یا یک کپی از فایل بگیرید و روی کپی کار کنید. ردیف «موجودی اول دوره» در تأمین‌کنندگان را نگه دارید یا موجودی واقعی را جایگزین کنید."
    )
    ws.cell(r, 1, txt).alignment = Alignment(wrap_text=True, horizontal="center", vertical="center")
    ws.cell(r, 1).font = F_CELL
    ws.cell(r, 1).fill = FILL_Y
    r += 4

    set_col_widths(ws, {"A": 22, "B": 36, "C": 28, "D": 28, "E": 36, "F": 28})
    ws.page_setup.orientation = "landscape"
    protect(ws)
    return ws


# ---------- Paper forms (Excel, A4, B&W) ----------

def paper_sheet(wb, title, subtitle, code):
    ws = wb.create_sheet(title)
    ws.sheet_view.rightToLeft = True
    ws.sheet_view.showGridLines = False
    ws.page_setup.paperSize = ws.PAPERSIZE_A4
    ws.page_setup.orientation = "portrait"
    ws.page_setup.fitToPage = True
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 1
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    ws.page_margins = PageMargins(left=0.5, right=0.5, top=0.5, bottom=0.5)
    ws.sheet_properties.tabColor = "666666"
    ws.print_options.horizontalCentered = True
    ws.oddFooter.center.text = "کارگاه بسته‌بندی حبوبات پلدختر — پلدختر | با خودکار پر شود"
    set_col_widths(ws, {get_column_letter(i): 12 for i in range(1, 9)})
    ws.column_dimensions["A"].width = 4
    ws.column_dimensions["H"].width = 4

    def box(r1, c1, r2, c2, value="", font=F_PAPER, fill=FILL_W, align=C_CTR, height=None):
        if r1 != r2 or c1 != c2:
            ws.merge_cells(start_row=r1, start_column=c1, end_row=r2, end_column=c2)
        cell = ws.cell(r1, c1, value)
        cell.font = font
        cell.fill = fill
        cell.alignment = align
        cell.protection = PROT_OPEN if fill == FILL_W and value == "" else PROT_LOCK
        for rr in range(r1, r2 + 1):
            for cc in range(c1, c2 + 1):
                ws.cell(rr, cc).border = PAPER_B
                if height:
                    ws.row_dimensions[rr].height = height
        return cell

    # outer title
    box(1, 2, 1, 7, "کارگاه بسته‌بندی حبوبات  |  پلدختر", F_PAPER_B, FILL_PAPER_H, C_CTR, 18)
    box(2, 2, 2, 7, title.replace("فرم ", ""), F_PAPER_T, FILL_W, C_CTR, 28)
    box(3, 2, 3, 4, f"کد فرم: {code}", F_PAPER, FILL_W, C_CTR, 18)
    box(3, 5, 3, 7, "تاریخ: ____ / ____ / ________", F_PAPER, FILL_W, C_CTR, 18)
    box(4, 2, 4, 7, subtitle, F_MUTED, FILL_PAPER_H, C_CTR, 18)
    return ws, box


def build_forms(wb: Workbook):
    # Form 1 receive
    ws, box = paper_sheet(wb, "فرم دریافت", "فرم ۱ — دریافت مواد اولیه  |  مسئول: پدر مدیر / مدیر", "F-01")
    fields = [
        (6, "نام تأمین‌کننده", 7, "شماره تماس"),
        (8, "نوع حبوبات", 9, "وزن (کیلوگرم)"),
        (10, "کیفیت ظاهری  □ عالی   □ خوب   □ متوسط   □ ضعیف", 11, "ضایعات / ناخالصی (کیلو یا توضیح)"),
        (12, "شماره پلاک / شرح بار", 13, "هزینه حمل (تومان)"),
    ]
    row = 6
    labels = [
        "نام تأمین‌کننده",
        "شماره تماس",
        "نوع حبوبات",
        "وزن کل (کیلوگرم)",
        "کیفیت   □ عالی    □ خوب    □ متوسط    □ ضعیف",
        "ضایعات / ناخالصی (کیلو یا شرح)",
        "شماره خودرو / شرح بار",
        "ساعت ورود",
    ]
    for lab in labels:
        box(row, 2, row, 3, lab, F_PAPER_B, FILL_PAPER_H, C_CTR, 26)
        box(row, 4, row, 7, "", F_PAPER, FILL_W, C_CTR, 26)
        row += 1
    box(row, 2, row + 3, 3, "توضیحات", F_PAPER_B, FILL_PAPER_H, C_CTR)
    box(row, 4, row + 3, 7, "", height=22)
    row += 4
    box(row, 2, row + 1, 4, "نظر مسئول انبار:\n□ قابل قبول    □ مشروط    □ رد", F_PAPER, FILL_W, C_CTR, 22)
    box(row, 5, row + 1, 7, "تأیید مدیر:\nنام: ............    امضا: ............", F_PAPER, FILL_W, C_CTR, 22)
    row += 3
    box(row, 2, row, 7, "پس از تأیید، مدیر همان روز در برگه Purchases ثبت می‌کند. یک داده، یک بار.", F_MUTED, FILL_PAPER_H, C_CTR, 20)

    # Form 2 production
    ws, box = paper_sheet(wb, "فرم تولید", "فرم ۲ — گزارش تولید روزانه  |  مسئول: نیروی بسته‌بندی", "F-02")
    labels = [
        "محصول (نوع حبوبات)",
        "مقدار ورودی به خط (کیلو)",
        "مقدار پاک‌شده (کیلو)",
        "مقدار ضایعات (کیلو)",
        "وزن هر بسته  □ ۴۰۰ گرم   □ ۹۰۰ گرم   □ ۱۰ کیلو",
        "تعداد بسته تولیدشده",
        "نام اپراتور",
        "ساعت شروع / پایان",
    ]
    row = 6
    for lab in labels:
        box(row, 2, row, 3, lab, F_PAPER_B, FILL_PAPER_H, C_CTR, 26)
        box(row, 4, row, 7, "", height=26)
        row += 1
    box(row, 2, row + 2, 3, "توضیحات / مشکل خط", F_PAPER_B, FILL_PAPER_H, C_CTR)
    box(row, 4, row + 2, 7, "")
    row += 3
    box(row, 2, row + 1, 4, "امضای اپراتور: ........................", F_PAPER, FILL_W, C_CTR, 22)
    box(row, 5, row + 1, 7, "امضای مسئول انبار: ........................", F_PAPER, FILL_W, C_CTR, 22)
    row += 3
    box(row, 2, row, 7, "درصد ضایعات را حساب نکنید. در Excel خودکار است. این فرم را آخر وقت به مدیر بدهید.", F_MUTED, FILL_PAPER_H, C_CTR, 20)

    # Form 3 dispatch to sales
    ws, box = paper_sheet(wb, "فرم تحویل پخش", "فرم ۳ — تحویل محصول به پخش  |  از انبار به ویزیتور", "F-03")
    box(6, 2, 6, 3, "نام ویزیتور", F_PAPER_B, FILL_PAPER_H, C_CTR, 24)
    box(6, 4, 6, 7, "", height=24)
    box(7, 2, 7, 3, "مقصد / مسیر", F_PAPER_B, FILL_PAPER_H, C_CTR, 24)
    box(7, 4, 7, 7, "", height=24)
    heads = ["ردیف", "محصول", "وزن بسته", "تعداد", "وزن کل", "توضیح"]
    for i, h in enumerate(heads):
        box(9, 2 + i, 9, 2 + i, h, F_PAPER_B, FILL_PAPER_H, C_CTR, 22)
    for i in range(10):
        rr = 10 + i
        box(rr, 2, rr, 2, str(i + 1), F_PAPER, FILL_PAPER_H, C_CTR, 22)
        for c in range(3, 8):
            box(rr, c, rr, c, "", height=22)
    box(21, 2, 22, 4, "تحویل‌دهنده (انبار)\nنام: ..........  امضا: ..........", F_PAPER, FILL_W, C_CTR, 20)
    box(21, 5, 22, 7, "تحویل‌گیرنده (ویزیتور)\nنام: ..........  امضا: ..........", F_PAPER, FILL_W, C_CTR, 20)

    # Form 4 visit
    ws, box = paper_sheet(wb, "فرم ویزیت", "فرم ۴ — گزارش روزانه ویزیتور", "F-04")
    labels = [
        "منطقه / مسیر",
        "تعداد ویزیت برنامه‌ریزی‌شده",
        "تعداد ویزیت انجام‌شده",
        "تعداد مشتریان جدید",
        "تعداد سفارش گرفته‌شده",
        "مبلغ فروش / سفارش (تومان)",
        "مبلغ وصول‌شده (تومان)",
        "کیلومتر شمار (شروع / پایان)",
        "هزینه سوخت (تومان)",
    ]
    row = 6
    for lab in labels:
        box(row, 2, row, 3, lab, F_PAPER_B, FILL_PAPER_H, C_CTR, 24)
        box(row, 4, row, 7, "", height=24)
        row += 1
    box(row, 2, row + 3, 3, "مشکلات مسیر / مشتری", F_PAPER_B, FILL_PAPER_H, C_CTR)
    box(row, 4, row + 3, 7, "")
    row += 4
    box(row, 2, row + 1, 7, "امضای ویزیتور: ........................        تأیید مدیر: ........................", F_PAPER, FILL_W, C_CTR, 22)

    # Form 5 goods out
    ws, box = paper_sheet(wb, "فرم خروج کالا", "فرم ۵ — خروج کالا برای مشتری", "F-05")
    box(6, 2, 6, 3, "نام مشتری", F_PAPER_B, FILL_PAPER_H, C_CTR, 24)
    box(6, 4, 6, 7, "")
    box(7, 2, 7, 3, "شهر / آدرس", F_PAPER_B, FILL_PAPER_H, C_CTR, 24)
    box(7, 4, 7, 7, "")
    heads = ["ردیف", "محصول", "تعداد", "مقدار (کیلو)", "مبلغ (تومان)", "توضیح"]
    for i, h in enumerate(heads):
        box(9, 2 + i, 9, 2 + i, h, F_PAPER_B, FILL_PAPER_H, C_CTR, 22)
    for i in range(8):
        rr = 10 + i
        box(rr, 2, rr, 2, str(i + 1), F_PAPER, FILL_PAPER_H, C_CTR, 22)
        for c in range(3, 8):
            box(rr, c, rr, c, "")
    box(19, 2, 19, 4, "جمع مبلغ: ........................ تومان", F_PAPER_B, FILL_W, C_CTR, 24)
    box(19, 5, 19, 7, "وصول در محل: □ کامل   □ بخشی   □ نسیه", F_PAPER, FILL_W, C_CTR, 24)
    box(21, 2, 22, 4, "تحویل‌دهنده\nنام: ..........  امضا: ..........", F_PAPER, FILL_W, C_CTR, 20)
    box(21, 5, 22, 7, "تحویل‌گیرنده (مشتری)\nنام: ..........  امضا: ..........", F_PAPER, FILL_W, C_CTR, 20)

    # Form 6 count
    ws, box = paper_sheet(wb, "فرم شمارش", "فرم ۶ — شمارش موجودی  |  مسئول: پدر مدیر", "F-06")
    box(6, 2, 6, 7, "شمارش باید با خلاصه برگه Inventory مقایسه شود. اختلاف را همان روز در دفتر تعدیل بزنید.", F_MUTED, FILL_PAPER_H, C_CTR, 20)
    heads = ["محصول", "مواد/نهایی", "ثبت سیستم", "موجودی واقعی", "اختلاف", "علت اختلاف"]
    for i, h in enumerate(heads):
        box(8, 2 + i, 8, 2 + i, h, F_PAPER_B, FILL_PAPER_H, C_CTR, 22)
    for i, p in enumerate(PRODUCTS + PRODUCTS):
        rr = 9 + i
        kind = "مواد اولیه" if i < len(PRODUCTS) else "محصول نهایی"
        prod = PRODUCTS[i % len(PRODUCTS)]
        box(rr, 2, rr, 2, prod, F_PAPER, FILL_PAPER_H, C_CTR, 20)
        box(rr, 3, rr, 3, kind, F_PAPER, FILL_W, C_CTR, 20)
        for c in range(4, 8):
            box(rr, c, rr, c, "")
    box(24, 2, 25, 7, "تأیید مسئول انبار: ..................     تأیید مدیر: ..................     تاریخ: ____ / ____ / ________", F_PAPER, FILL_W, C_CTR, 20)

    # Form 7 expenses
    ws, box = paper_sheet(wb, "فرم هزینه", "فرم ۷ — ثبت هزینه", "F-07")
    labels = [
        "نوع هزینه  □ حقوق  □ اجاره  □ برق  □ گاز  □ سوخت  □ بسته‌بندی  □ تعمیرات  □ حمل  □ آب  □ متفرقه",
        "مبلغ (تومان) — به عدد",
        "مبلغ به حروف",
        "پرداخت‌کننده",
        "روش پرداخت   □ نقد   □ کارت   □ چک   □ نسیه",
        "شرح / بابت",
    ]
    row = 6
    heights = [36, 26, 26, 26, 26, 48]
    for lab, h in zip(labels, heights):
        box(row, 2, row, 3, lab, F_PAPER_B, FILL_PAPER_H, C_CTR, h)
        box(row, 4, row, 7, "", height=h)
        row += 1
    box(row + 1, 2, row + 2, 7, "امضای پرداخت‌کننده: ..................          تأیید مدیر: ..................", F_PAPER, FILL_W, C_CTR, 22)

    # Form 8 supplier eval
    ws, box = paper_sheet(wb, "فرم ارزیابی تأمین", "فرم ۸ — ارزیابی تأمین‌کننده  |  امتیاز ۱ (ضعیف) تا ۱۰ (عالی)", "F-08")
    box(6, 2, 6, 3, "نام تأمین‌کننده", F_PAPER_B, FILL_PAPER_H, C_CTR, 24)
    box(6, 4, 6, 7, "")
    box(7, 2, 7, 3, "محصول مورد ارزیابی", F_PAPER_B, FILL_PAPER_H, C_CTR, 24)
    box(7, 4, 7, 7, "")
    box(8, 2, 8, 3, "تاریخ بار", F_PAPER_B, FILL_PAPER_H, C_CTR, 24)
    box(8, 4, 8, 7, "")
    heads = ["معیار", "امتیاز ۱ تا ۱۰", "توضیح کوتاه"]
    box(10, 2, 10, 3, "معیار", F_PAPER_B, FILL_PAPER_H, C_CTR, 22)
    box(10, 4, 10, 4, "امتیاز (۱–۱۰)", F_PAPER_B, FILL_PAPER_H, C_CTR, 22)
    box(10, 5, 10, 7, "توضیح", F_PAPER_B, FILL_PAPER_H, C_CTR, 22)
    criteria = ["قیمت", "کیفیت", "تحویل به‌موقع", "ثبات تأمین", "شرایط پرداخت"]
    for i, cr in enumerate(criteria):
        rr = 11 + i
        box(rr, 2, rr, 3, cr, F_PAPER_B, FILL_PAPER_H, C_CTR, 28)
        box(rr, 4, rr, 4, "", height=28)
        box(rr, 5, rr, 7, "", height=28)
    box(17, 2, 17, 3, "جمع / میانگین", F_PAPER_B, FILL_PAPER_H, C_CTR, 24)
    box(17, 4, 17, 7, "میانگین را در برگه Suppliers وارد کنید", F_PAPER, FILL_W, C_CTR, 24)
    box(19, 2, 20, 7, "تصمیم:   □ ادامه همکاری    □ تذکر    □ قطع همکاری\nامضای مدیر: ........................", F_PAPER, FILL_W, C_CTR, 22)


def build_seed_json():
    seed = {
        "meta": {
            "workshop": "کارگاه بسته‌بندی حبوبات پلدختر",
            "city": "پلدختر",
            "year": 1405,
            "month": 6,
            "today": "1405/06/18",
            "currency": "تومان",
        },
        "products": PRODUCTS,
        "packs": PACKS,
        "purchases": [
            {
                "date": p[0], "supplier": p[1], "product": p[2], "kg": p[3],
                "price": p[4], "freight": p[5], "quality": p[6], "status": p[7], "note": p[8],
            }
            for p in PURCHASES
        ],
        "production": [
            {
                "date": p[0], "product": p[1], "inputKg": p[2], "cleanKg": p[3],
                "packKg": p[4], "operator": p[5], "note": p[6],
            }
            for p in PRODUCTION
        ],
        "sales": [
            {
                "date": s[0], "customer": s[1], "city": s[2], "product": s[3],
                "packKg": s[4], "qty": s[5], "unitPrice": s[6], "discount": s[7],
                "collected": s[8], "seller": s[9],
            }
            for s in SALES
        ],
        "customers": [
            {
                "name": c[0], "phone": c[1], "city": c[2], "address": c[3],
                "type": c[4], "lastVisit": c[5], "status": c[6], "note": c[7],
            }
            for c in CUSTOMERS
        ],
        "visits": [
            {
                "date": v[0], "region": v[1], "planned": v[2], "visited": v[3],
                "orders": v[4], "orderAmount": v[5], "newCustomers": v[6],
                "collected": v[7], "km": v[8], "fuel": v[9], "note": v[10],
            }
            for v in VISITS
        ],
        "expenses": [
            {"date": e[0], "type": e[1], "amount": e[2], "payer": e[3], "method": e[4], "note": e[5]}
            for e in EXPENSES
        ],
        "suppliers": [
            {
                "name": s[0], "phone": s[1], "city": s[2], "product": s[3], "price": s[4],
                "quality": s[5], "payTerms": s[6], "days": s[7],
                "scorePrice": s[8], "scoreQuality": s[9], "scoreDelivery": s[10],
                "scoreStability": s[11], "scorePay": s[12], "status": s[13], "note": s[14],
            }
            for s in SUPPLIERS
        ],
        "employees": [
            {
                "name": e[0], "role": e[1], "duties": e[2], "salary": e[3],
                "commissionRate": e[4], "start": e[5], "status": e[6], "note": e[7],
            }
            for e in EMPLOYEES
        ],
        "inventoryMoves": [
            {
                "date": m[0], "kind": m[1], "product": m[2], "inn": m[3],
                "out": m[4], "unit": m[5], "loc": m[6], "reason": m[7],
            }
            for m in INV_MOVES
        ],
        "kpis": [
            {
                "key": k[0], "name": k[1], "green": k[2], "yellow": k[3],
                "direction": k[4], "unit": k[5], "actionRed": k[6], "actionYellow": k[7],
            }
            for k in KPIS
        ],
        "lists": {
            "quality": QUALITY,
            "approval": APPROVAL,
            "custTypes": CUST_TYPES,
            "expenseTypes": EXPENSE_TYPES,
            "payMethods": PAY_METHODS,
            "cities": CITIES,
            "regions": REGIONS,
        },
    }
    SEED_PATH.parent.mkdir(parents=True, exist_ok=True)
    SEED_PATH.write_text(json.dumps(seed, ensure_ascii=False, indent=2), encoding="utf-8")
    return seed


def build_pdf():
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.ttfonts import TTFont
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    import arabic_reshaper
    from bidi.algorithm import get_display

    regular = str(FONTS / "Vazirmatn-Regular.ttf")
    bold = str(FONTS / "Vazirmatn-Bold.ttf")
    pdfmetrics.registerFont(TTFont("Vazir", regular))
    pdfmetrics.registerFont(TTFont("VazirB", bold))

    def ar(text: str) -> str:
        return get_display(arabic_reshaper.reshape(text))

    out = PUBLIC / "formha-chapi-A4.pdf"
    c = canvas.Canvas(str(out), pagesize=A4)
    W, H = A4

    def frame():
        c.setLineWidth(1.2)
        c.rect(12 * mm, 12 * mm, W - 24 * mm, H - 24 * mm)
        c.setLineWidth(0.4)
        c.rect(14 * mm, 14 * mm, W - 28 * mm, H - 28 * mm)

    def header(title, code):
        frame()
        c.setFillGray(0.93)
        c.rect(16 * mm, H - 32 * mm, W - 32 * mm, 14 * mm, fill=1, stroke=0)
        c.setFillGray(0)
        c.setFont("VazirB", 11)
        c.drawCentredString(W / 2, H - 22 * mm, ar("کارگاه بسته‌بندی حبوبات پلدختر"))
        c.setFont("VazirB", 16)
        c.drawCentredString(W / 2, H - 42 * mm, ar(title))
        c.setFont("Vazir", 9)
        c.drawRightString(W - 18 * mm, H - 52 * mm, ar(f"کد: {code}"))
        c.drawString(18 * mm, H - 52 * mm, ar("تاریخ: ____ / ____ / ________"))
        c.line(16 * mm, H - 56 * mm, W - 16 * mm, H - 56 * mm)

    def field(y, label, h=12 * mm):
        c.setLineWidth(0.6)
        c.rect(18 * mm, y - h + 3 * mm, W - 36 * mm, h)
        c.setFillGray(0.94)
        c.rect(18 * mm, y - h + 3 * mm, 52 * mm, h, fill=1, stroke=1)
        c.setFillGray(0)
        c.setFont("Vazir", 9)
        c.drawCentredString(18 * mm + 26 * mm, y - 5 * mm, ar(label))
        return y - h

    def checkbox_line(y, text):
        c.setFont("Vazir", 10)
        c.drawRightString(W - 20 * mm, y, ar(text))
        return y - 8 * mm

    def footer_note(text):
        c.setFont("Vazir", 8)
        c.drawCentredString(W / 2, 18 * mm, ar(text))

    def sign_row(y, left, right):
        c.setLineWidth(0.6)
        c.rect(18 * mm, y - 18 * mm, (W - 40 * mm) / 2, 22 * mm)
        c.rect(18 * mm + (W - 36 * mm) / 2, y - 18 * mm, (W - 40 * mm) / 2, 22 * mm)
        c.setFont("Vazir", 9)
        c.drawCentredString(18 * mm + (W - 40 * mm) / 4, y - 4 * mm, ar(left))
        c.drawCentredString(18 * mm + 3 * (W - 40 * mm) / 4 + 4 * mm, y - 4 * mm, ar(right))

    # 1
    header("فرم دریافت مواد اولیه", "F-01")
    y = H - 64 * mm
    for lab in ["نام تأمین‌کننده", "نوع حبوبات", "وزن (کیلوگرم)", "کیفیت", "ضایعات / ناخالصی", "شماره خودرو", "توضیحات"]:
        y = field(y, lab, 14 * mm if lab != "توضیحات" else 22 * mm)
    y -= 4 * mm
    y = checkbox_line(y, "کیفیت:    □ عالی     □ خوب     □ متوسط     □ ضعیف")
    y = checkbox_line(y, "نتیجه:    □ قابل قبول     □ مشروط     □ رد")
    sign_row(40 * mm, "تأیید مسئول انبار + امضا", "تأیید مدیر + امضا")
    footer_note("پس از تأیید، فقط یک‌بار در برگه Purchases ثبت شود.")
    c.showPage()

    # 2
    header("گزارش تولید روزانه", "F-02")
    y = H - 64 * mm
    for lab in ["محصول", "مقدار ورودی (کیلو)", "مقدار پاک‌شده (کیلو)", "مقدار ضایعات (کیلو)",
                "وزن بسته", "تعداد بسته", "نام اپراتور", "ساعت شروع / پایان", "توضیحات"]:
        y = field(y, lab, 13 * mm if lab != "توضیحات" else 20 * mm)
    y = checkbox_line(y - 2 * mm, "وزن بسته:    □ ۴۰۰ گرم     □ ۹۰۰ گرم     □ ۱۰ کیلوگرم")
    sign_row(40 * mm, "امضای اپراتور", "امضای مسئول انبار")
    footer_note("درصد ضایعات را حساب نکنید؛ در Excel خودکار است.")
    c.showPage()

    # 3
    header("تحویل محصول به پخش", "F-03")
    y = H - 64 * mm
    y = field(y, "نام ویزیتور")
    y = field(y, "مقصد / مسیر")
    y -= 2 * mm
    # table
    c.setFont("VazirB", 9)
    cols = [18, 28, 70, 100, 128, 155]
    widths = [10, 42, 30, 28, 27, 37]
    headers_t = ["ردیف", "محصول", "وزن بسته", "تعداد", "وزن کل", "توضیح"]
    table_top = y
    row_h = 9 * mm
    n = 10
    c.setLineWidth(0.5)
    for i in range(n + 2):
        yy = table_top - i * row_h
        c.line(18 * mm, yy, W - 18 * mm, yy)
    x = 18 * mm
    for w in widths:
        c.line(x, table_top, x, table_top - (n + 1) * row_h)
        x += w * mm
    c.line(W - 18 * mm, table_top, W - 18 * mm, table_top - (n + 1) * row_h)
    c.setFont("Vazir", 8)
    x = 18 * mm
    for h, w in zip(headers_t, widths):
        c.drawCentredString(x + w * mm / 2, table_top - 6 * mm, ar(h))
        x += w * mm
    for i in range(1, n + 1):
        c.drawCentredString(18 * mm + 5 * mm, table_top - (i + 1) * row_h + 3 * mm, str(i))
    sign_row(40 * mm, "تحویل‌دهنده انبار + امضا", "تحویل‌گیرنده ویزیتور + امضا")
    footer_note("این فرم مبنای خروج از انبار محصول نهایی است.")
    c.showPage()

    # 4
    header("گزارش روزانه ویزیتور", "F-04")
    y = H - 64 * mm
    for lab in ["منطقه / مسیر", "ویزیت برنامه‌ریزی‌شده", "ویزیت انجام‌شده", "مشتریان جدید",
                "تعداد سفارش", "مبلغ فروش (تومان)", "مبلغ وصول‌شده (تومان)", "کیلومتر شروع / پایان",
                "هزینه سوخت (تومان)", "مشکلات"]:
        y = field(y, lab, 12 * mm if lab != "مشکلات" else 22 * mm)
    sign_row(40 * mm, "امضای ویزیتور", "تأیید مدیر")
    footer_note("آخر وقت به مدیر تحویل شود. KPI ویزیت در Excel خودکار است.")
    c.showPage()

    # 5
    header("خروج کالا", "F-05")
    y = H - 64 * mm
    y = field(y, "نام مشتری")
    y = field(y, "شهر / آدرس")
    table_top = y
    widths = [10, 42, 28, 32, 36, 26]
    headers_t = ["ردیف", "محصول", "تعداد", "مقدار", "مبلغ", "توضیح"]
    n = 8
    row_h = 9 * mm
    c.setLineWidth(0.5)
    for i in range(n + 2):
        yy = table_top - i * row_h
        c.line(18 * mm, yy, W - 18 * mm, yy)
    x = 18 * mm
    for w in widths:
        c.line(x, table_top, x, table_top - (n + 1) * row_h)
        x += w * mm
    c.line(W - 18 * mm, table_top, W - 18 * mm, table_top - (n + 1) * row_h)
    c.setFont("Vazir", 8)
    x = 18 * mm
    for h, w in zip(headers_t, widths):
        c.drawCentredString(x + w * mm / 2, table_top - 6 * mm, ar(h))
        x += w * mm
    y = table_top - (n + 1) * row_h - 8 * mm
    y = checkbox_line(y, "وصول:    □ کامل     □ بخشی     □ نسیه")
    sign_row(40 * mm, "تحویل‌دهنده + امضا", "تحویل‌گیرنده مشتری + امضا")
    footer_note("نسخه مشتری و نسخه کارگاه. بعداً در برگه Sales ثبت شود.")
    c.showPage()

    # 6
    header("شمارش موجودی", "F-06")
    y = H - 62 * mm
    c.setFont("Vazir", 9)
    c.drawCentredString(W / 2, y, ar("اختلاف را همان روز در دفتر تعدیل برگه Inventory وارد کنید."))
    y -= 8 * mm
    headers_t = ["محصول", "نوع", "ثبت سیستم", "واقعی", "اختلاف", "علت"]
    widths = [36, 28, 28, 26, 24, 32]
    n = 14
    row_h = 9 * mm
    table_top = y
    c.setLineWidth(0.5)
    for i in range(n + 2):
        c.line(18 * mm, table_top - i * row_h, W - 18 * mm, table_top - i * row_h)
    x = 18 * mm
    for w in widths:
        c.line(x, table_top, x, table_top - (n + 1) * row_h)
        x += w * mm
    c.line(W - 18 * mm, table_top, W - 18 * mm, table_top - (n + 1) * row_h)
    c.setFont("Vazir", 8)
    x = 18 * mm
    for h, w in zip(headers_t, widths):
        c.drawCentredString(x + w * mm / 2, table_top - 6 * mm, ar(h))
        x += w * mm
    kinds = ["مواد اولیه"] * 7 + ["محصول نهایی"] * 7
    prods = PRODUCTS + PRODUCTS
    for i, (p, k) in enumerate(zip(prods, kinds), 1):
        yy = table_top - (i + 1) * row_h + 3 * mm
        c.drawCentredString(18 * mm + 18 * mm, yy, ar(p))
        c.drawCentredString(18 * mm + 36 * mm + 14 * mm, yy, ar(k))
    sign_row(36 * mm, "تأیید مسئول انبار", "تأیید مدیر")
    footer_note("حداقل ماهی یک‌بار شمارش کامل انجام شود.")
    c.showPage()

    # 7
    header("ثبت هزینه", "F-07")
    y = H - 64 * mm
    y = field(y, "نوع هزینه", 18 * mm)
    c.setFont("Vazir", 8)
    c.drawRightString(W - 22 * mm, y + 8 * mm, ar("□ حقوق  □ اجاره  □ برق  □ گاز  □ سوخت  □ بسته‌بندی  □ تعمیرات  □ حمل  □ آب  □ متفرقه"))
    for lab in ["مبلغ به عدد (تومان)", "مبلغ به حروف", "پرداخت‌کننده", "روش پرداخت", "شرح"]:
        y = field(y, lab, 14 * mm if lab != "شرح" else 24 * mm)
    y = checkbox_line(y - 2 * mm, "روش:    □ نقد     □ کارت     □ چک     □ نسیه")
    sign_row(40 * mm, "امضای پرداخت‌کننده", "تأیید مدیر")
    footer_note("بعد از امضا در برگه Expenses ثبت شود.")
    c.showPage()

    # 8
    header("ارزیابی تأمین‌کننده", "F-08")
    y = H - 64 * mm
    y = field(y, "نام تأمین‌کننده")
    y = field(y, "محصول")
    y = field(y, "تاریخ بار")
    c.setFont("Vazir", 9)
    c.drawCentredString(W / 2, y - 2 * mm, ar("امتیاز از ۱ (ضعیف) تا ۱۰ (عالی)"))
    y -= 10 * mm
    headers_t = ["معیار", "امتیاز ۱–۱۰", "توضیح"]
    widths = [50, 36, 88]
    n = 5
    row_h = 14 * mm
    table_top = y
    c.setLineWidth(0.5)
    for i in range(n + 2):
        c.line(18 * mm, table_top - i * row_h, W - 18 * mm, table_top - i * row_h)
    x = 18 * mm
    for w in widths:
        c.line(x, table_top, x, table_top - (n + 1) * row_h)
        x += w * mm
    c.line(W - 18 * mm, table_top, W - 18 * mm, table_top - (n + 1) * row_h)
    c.setFont("Vazir", 9)
    x = 18 * mm
    for h, w in zip(headers_t, widths):
        c.drawCentredString(x + w * mm / 2, table_top - 8 * mm, ar(h))
        x += w * mm
    for i, cr in enumerate(["قیمت", "کیفیت", "تحویل به‌موقع", "ثبات تأمین", "شرایط پرداخت"], 1):
        c.drawCentredString(18 * mm + 25 * mm, table_top - (i + 1) * row_h + 5 * mm, ar(cr))
    y = table_top - (n + 1) * row_h - 10 * mm
    y = checkbox_line(y, "تصمیم:    □ ادامه همکاری     □ تذکر     □ قطع همکاری")
    sign_row(40 * mm, "امتیازها را در برگه Suppliers وارد کنید", "امضا و نام مدیر")
    footer_note("میانگین پنج امتیاز، امتیاز کل تأمین‌کننده است.")
    c.showPage()

    c.save()
    return out


def main():
    PUBLIC.mkdir(parents=True, exist_ok=True)
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    HOME_ART.mkdir(parents=True, exist_ok=True)

    wb = Workbook()
    # remove default
    default = wb.active
    wb.remove(default)

    build_guide(wb)
    build_settings(wb)
    build_lists(wb)
    build_purchases(wb)
    build_inventory(wb)
    build_production(wb)
    build_sales(wb)
    build_customers(wb)
    build_salesrep(wb)
    build_expenses(wb)
    build_suppliers(wb)
    build_employees(wb)
    build_report(wb)
    build_forms(wb)
    build_dashboard(wb)

    # Move dashboard after guide
    # current order depends on create_sheet positions. Enforce:
    desired = [
        "راهنما", "Dashboard", "تنظیمات",
        "Purchases", "Inventory", "Production", "Sales",
        "Customers", "SalesRep", "Expenses", "Suppliers", "Employees",
        "گزارش",
        "فرم دریافت", "فرم تولید", "فرم تحویل پخش", "فرم ویزیت",
        "فرم خروج کالا", "فرم شمارش", "فرم هزینه", "فرم ارزیابی تأمین",
        "Lists",
    ]
    for i, name in enumerate(desired):
        if name in wb.sheetnames:
            wb.move_sheet(name, offset=i - wb.sheetnames.index(name))

    wb.active = wb["Dashboard"]
    wb.properties.title = "سامانه مدیریت کارگاه بسته‌بندی حبوبات پلدختر"
    wb.properties.creator = "سامانه کارگاه پلدختر"
    wb.properties.description = "ثبت اطلاعات → KPI → داشبورد → اقدام اصلاحی"
    wb.properties.subject = "حبوبات پلدختر"

    xlsx_name = "سامانه-مدیریت-کارگاه-حبوبات-پلدختر.xlsx"
    dests = [
        PUBLIC / xlsx_name,
        ARTIFACTS / xlsx_name,
        HOME_ART / xlsx_name,
    ]
    # save once then copy (openpyxl path with Persian is fine)
    primary = ARTIFACTS / xlsx_name
    wb.save(primary)
    for d in dests:
        if d.resolve() != primary.resolve():
            shutil.copy2(primary, d)

    seed = build_seed_json()
    pdf = build_pdf()
    shutil.copy2(pdf, ARTIFACTS / pdf.name)
    shutil.copy2(pdf, HOME_ART / pdf.name)

    print("xlsx:", primary, "size", primary.stat().st_size)
    print("pdf:", pdf, "size", pdf.stat().st_size)
    print("sheets:", wb.sheetnames)
    print("seed keys:", list(seed.keys()))


if __name__ == "__main__":
    main()
