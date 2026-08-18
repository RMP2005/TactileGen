import cv2
import numpy as np


class Simplifier:

    def __init__(self):
        pass


    def simplify(
        self,
        img_bgr: np.ndarray,
        regions: list,
        labels: list,
        level: float = 0.5
    ) -> list:


        gray = cv2.cvtColor(
            img_bgr,
            cv2.COLOR_BGR2GRAY
        )


        # Remove OCR text regions
        clean = gray.copy()


        for label in labels:

            x, y, w, h = label["bbox"]

            cv2.rectangle(
                clean,
                (max(0, x - 8), max(0, y - 8)),
                (x + w + 8, y + h + 8),
                255,
                -1
            )


        # Slight smoothing
        blur = cv2.GaussianBlur(
            clean,
            (5, 5),
            0
        )


        # Detect meaningful edges
        edges = cv2.Canny(
            blur,
            90,
            180
        )


        # Keep connected structures but don't over merge
        kernel = cv2.getStructuringElement(
            cv2.MORPH_RECT,
            (3, 3)
        )


        edges = cv2.morphologyEx(
            edges,
            cv2.MORPH_CLOSE,
            kernel,
            iterations=1
        )


        contours, _ = cv2.findContours(
            edges,
            cv2.RETR_LIST,
            cv2.CHAIN_APPROX_SIMPLE
        )


        simplified_paths = []


        for contour in contours:


            length = cv2.arcLength(
                contour,
                False
            )


            # remove tiny noise only
            if length < 45:
                continue



            epsilon = (
                0.010 +
                level * 0.015
            ) * length



            approx = cv2.approxPolyDP(
                contour,
                epsilon,
                False
            )


            points = approx.reshape(
                -1,
                2
            ).tolist()



            if len(points) >= 2:

                simplified_paths.append(
                    points
                )


        return simplified_paths