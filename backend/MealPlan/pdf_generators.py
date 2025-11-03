from __future__ import annotations

from abc import ABC, abstractmethod
from io import BytesIO
import re
from typing import Dict, List, Tuple, TYPE_CHECKING

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.lib.utils import simpleSplit
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

if TYPE_CHECKING:  # pragma: no cover - solo para tipeo estático
    from .models import MealPlan


class MealPlanPDFGenerator(ABC):
    """Contrato para generadores de PDFs de planes alimenticios."""

    @abstractmethod
    def build_pdf(self, meal_plan: "MealPlan") -> bytes:
        """Genera el PDF del plan alimenticio provisto."""


class PlainMealPlanPDFGenerator(MealPlanPDFGenerator):
    """Generador simple centrado en legibilidad."""

    margin_x = 40
    margin_y = 50

    def build_pdf(self, meal_plan: "MealPlan") -> bytes:
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        title = "Plan alimenticio semanal"
        user_label = self._get_user_label(meal_plan)
        subtitle = f"Del {meal_plan.start_date} al {meal_plan.end_date}"

        pdf.setTitle(title)
        y_position = height - self.margin_y

        pdf.setFont("Helvetica-Bold", 18)
        pdf.drawString(self.margin_x, y_position, title)

        y_position -= 24
        pdf.setFont("Helvetica", 12)
        pdf.drawString(self.margin_x, y_position, user_label)

        y_position -= 18
        pdf.drawString(self.margin_x, y_position, subtitle)

        y_position -= 28

        plan_data, notes = _extract_plan_data(meal_plan.plan)

        pdf.setFont("Helvetica", 11)

        for day_label, meals in plan_data:
            y_position = self._draw_section_title(pdf, day_label, y_position)
            for meal_label, description in meals:
                y_position = self._draw_meal_block(pdf, meal_label, description, y_position, width)

            y_position -= 12

            if y_position <= self.margin_y:
                pdf.showPage()
                pdf.setFont("Helvetica", 11)
                y_position = height - self.margin_y

        if notes:
            pdf.setFont("Helvetica-Bold", 12)
            if y_position <= self.margin_y:
                pdf.showPage()
                pdf.setFont("Helvetica-Bold", 12)
                y_position = height - self.margin_y
            pdf.drawString(self.margin_x, y_position, "Notas")
            y_position -= 18
            pdf.setFont("Helvetica", 11)
            y_position = self._draw_paragraph(pdf, notes, y_position, width)

        pdf.showPage()
        pdf.save()

        buffer.seek(0)
        return buffer.getvalue()

    def _get_user_label(self, meal_plan: "MealPlan") -> str:
        user = meal_plan.user
        full_name = getattr(user, "full_name", "") or user.get_full_name() or user.username
        return f"Usuario: {full_name}"

    def _draw_section_title(self, pdf: canvas.Canvas, title: str, y_position: float) -> float:
        if y_position <= self.margin_y:
            pdf.showPage()
            pdf.setFont("Helvetica", 11)
            y_position = letter[1] - self.margin_y

        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(self.margin_x, y_position, title)
        pdf.setFont("Helvetica", 11)
        return y_position - 18

    def _draw_meal_block(
        self,
        pdf: canvas.Canvas,
        meal_label: str,
        description: str,
        y_position: float,
        page_width: float,
    ) -> float:
        label_text = f"{meal_label}:"
        pdf.setFont("Helvetica-Bold", 11)
        if y_position <= self.margin_y:
            pdf.showPage()
            pdf.setFont("Helvetica", 11)
            y_position = letter[1] - self.margin_y

        pdf.drawString(self.margin_x, y_position, label_text)
        pdf.setFont("Helvetica", 11)
        y_position -= 16
        y_position = self._draw_paragraph(pdf, description, y_position, page_width)
        return y_position - 8

    def _draw_paragraph(
        self,
        pdf: canvas.Canvas,
        text: str,
        y_position: float,
        page_width: float,
    ) -> float:
        available_width = page_width - (2 * self.margin_x)
        lines = simpleSplit(text, "Helvetica", 11, available_width)
        for line in lines:
            if y_position <= self.margin_y:
                pdf.showPage()
                pdf.setFont("Helvetica", 11)
                y_position = letter[1] - self.margin_y
            pdf.drawString(self.margin_x, y_position, line)
            y_position -= 14
        return y_position


class StyledMealPlanPDFGenerator(MealPlanPDFGenerator):
    """Generador con formato más visual utilizando tablas y estilos."""

    def build_pdf(self, meal_plan: "MealPlan") -> bytes:
        buffer = BytesIO()
        document = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            topMargin=0.75 * inch,
            bottomMargin=0.75 * inch,
            leftMargin=0.75 * inch,
            rightMargin=0.75 * inch,
            title="Plan alimenticio semanal",
        )

        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name="DayTitle", fontSize=14, leading=18, spaceAfter=12, spaceBefore=12, fontName="Helvetica-Bold", textColor=colors.HexColor("#2F855A")))
        styles.add(ParagraphStyle(name="MealLabel", fontSize=12, leading=14, fontName="Helvetica-Bold"))
        styles.add(ParagraphStyle(name="MealText", fontSize=11, leading=14))
        styles.add(ParagraphStyle(name="Subtitle", fontSize=11, leading=14, textColor=colors.HexColor("#4A5568")))

        user_label = PlainMealPlanPDFGenerator()._get_user_label(meal_plan)
        subtitle = f"Del {meal_plan.start_date} al {meal_plan.end_date}"

        elements: List = []
        elements.append(Paragraph("Plan alimenticio semanal", styles["Title"]))
        elements.append(Paragraph(user_label, styles["Subtitle"]))
        elements.append(Paragraph(subtitle, styles["Subtitle"]))
        elements.append(Spacer(1, 0.2 * inch))

        plan_data, notes = _extract_plan_data(meal_plan.plan)

        for day_label, meals in plan_data:
            elements.append(Paragraph(day_label, styles["DayTitle"]))
            table_data = [[Paragraph(label + ":", styles["MealLabel"]), Paragraph(description, styles["MealText"])] for label, description in meals]

            table = Table(table_data, colWidths=[1.2 * inch, 4.8 * inch])
            table.setStyle(
                TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), colors.whitesmoke),
                        ("BOX", (0, 0), (-1, -1), 0.75, colors.HexColor("#2F855A")),
                        ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#68D391")),
                        ("VALIGN", (0, 0), (-1, -1), "TOP"),
                        ("LEFTPADDING", (0, 0), (-1, -1), 8),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                        ("TOPPADDING", (0, 0), (-1, -1), 6),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                    ]
                )
            )
            elements.append(table)

        if notes:
            elements.append(Spacer(1, 0.3 * inch))
            elements.append(Paragraph("Notas", styles["Heading2"]))
            elements.append(Paragraph(notes, styles["BodyText"]))

        document.build(elements)
        buffer.seek(0)
        return buffer.getvalue()


class MealPlanPDFService:
    """Caso de uso que delega la generación a un generador concreto."""

    def __init__(self, generator: MealPlanPDFGenerator):
        self._generator = generator

    def export(self, meal_plan: "MealPlan") -> bytes:
        return self._generator.build_pdf(meal_plan)


def _extract_plan_data(plan: Dict) -> Tuple[List[Tuple[str, List[Tuple[str, str]]]], str]:
    """Normaliza la estructura del plan para el render."""
    if not isinstance(plan, dict):
        return [], ""

    day_pattern = re.compile(r"día\s*(\d+)", re.IGNORECASE)
    day_entries: List[Tuple[int, str, List[Tuple[str, str]]]] = []

    for key, value in plan.items():
        match = day_pattern.match(str(key))
        if not match or not isinstance(value, dict):
            continue
        index = int(match.group(1))
        meals = []
        for meal_key in ("desayuno", "almuerzo", "cena"):
            if meal_key in value:
                meals.append((meal_key.capitalize(), str(value.get(meal_key, "")).strip()))
        day_entries.append((index, f"Día {index}", meals))

    sorted_days = sorted(day_entries, key=lambda item: item[0])
    normalized_days = [(label, meals) for _, label, meals in sorted_days]
    notes = str(plan.get("nota", "")).strip()
    return normalized_days, notes


