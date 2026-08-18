import cv2
import numpy as np
from app.utils.memlog import log_mem


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

        log_mem("simplify_start")

        gray = cv2.cvtColor(
            img_bgr,
            cv2.COLOR_BGR2GRAY
        )

        # remove OCR text areas — paint white in-place on gray
        for label in labels:
            x, y, w, h = label["bbox"]
            cv2.rectangle(
                gray,
                (max(0, x - 8), max(0, y - 8)),
                (x + w + 8, y + h + 8),
                255,
                -1
            )


        # gentle smoothing
        blur = cv2.GaussianBlur(
            gray,
            (5, 5),
            0
        )

        del gray


        # edge detection
        edges = cv2.Canny(
            blur,
            90,
            180
        )

        del blur


        # connect broken lines slightly
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

        del kernel


        contours, _ = cv2.findContours(
            edges,
            cv2.RETR_LIST,
            cv2.CHAIN_APPROX_SIMPLE
        )

        del edges


        simplified_paths = []


        for contour in contours:


            length = cv2.arcLength(
                contour,
                False
            )


            # remove only very tiny noise
            if length < 35:
                continue



            epsilon = (
                0.012 +
                level * 0.010
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



        # keep meaningful paths first
        simplified_paths.sort(
            key=lambda x: len(x),
            reverse=True
        )

        log_mem("simplify_end")

        return simplified_paths[:100]
