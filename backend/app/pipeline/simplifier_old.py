import cv2
import numpy as np


class Simplifier:

    def __init__(self):
        pass


    def _zhang_suen_thinning(self, img: np.ndarray) -> np.ndarray:

        size = np.size(img)
        skel = np.zeros(img.shape, np.uint8)

        _, img = cv2.threshold(
            img,
            127,
            255,
            0
        )

        element = cv2.getStructuringElement(
            cv2.MORPH_CROSS,
            (3, 3)
        )

        done = False

        while not done:

            eroded = cv2.erode(img, element)

            temp = cv2.dilate(
                eroded,
                element
            )

            temp = cv2.subtract(
                img,
                temp
            )

            skel = cv2.bitwise_or(
                skel,
                temp
            )

            img = eroded.copy()

            if size - cv2.countNonZero(img) == size:
                done = True

        return skel



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


        # remove OCR label regions
        clean = gray.copy()

        for label in labels:

            x, y, w, h = label["bbox"]

            pad = 10

            x1 = max(0, x - pad)
            y1 = max(0, y - pad)

            x2 = min(
                clean.shape[1],
                x + w + pad
            )

            y2 = min(
                clean.shape[0],
                y + h + pad
            )


            cv2.rectangle(
                clean,
                (x1, y1),
                (x2, y2),
                255,
                -1
            )



        blur = cv2.GaussianBlur(
            clean,
            (5,5),
            0
        )


        edges = cv2.Canny(
            blur,
            100,
            220
        )


        try:

            skeleton = cv2.ximgproc.thinning(
                edges
            )

        except AttributeError:

            skeleton = self._zhang_suen_thinning(
                edges
            )



        contours, _ = cv2.findContours(
            skeleton,
            cv2.RETR_LIST,
            cv2.CHAIN_APPROX_SIMPLE
        )



        simplified_paths = []



        for contour in contours:

            length = cv2.arcLength(
                contour,
                False
            )


            if length < 150:
                continue


            epsilon = 0.07 * length


            approx = cv2.approxPolyDP(
                contour,
                epsilon,
                False
            )


            if len(approx) >= 3:

                simplified_paths.append(
                    approx.reshape(
                        -1,
                        2
                    ).tolist()
                )



        return simplified_paths