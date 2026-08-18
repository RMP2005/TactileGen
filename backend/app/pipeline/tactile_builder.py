import cv2
import numpy as np
from app.utils.image_io import encode_image


class TactileBuilder:

    def __init__(self):
        pass


    def build(
        self,
        width: int,
        height: int,
        paths: list,
        regions: list,
        labels: list,
        stroke_width: int
    ):

        # ---------------- SVG ----------------

        svg_parts = [
            f'<svg xmlns="http://www.w3.org/2000/svg" '
            f'width="{width}" height="{height}" '
            f'viewBox="0 0 {width} {height}" '
            f'style="background:white;">'
        ]


        # Main semantic regions
        for r in regions:

            contour = np.array(
                r["contour"],
                dtype=np.int32
            )


            if len(contour) < 3:
                continue


            contour = contour.reshape(
                (-1,1,2)
            )


            epsilon = (
                0.02 *
                cv2.arcLength(
                    contour,
                    True
                )
            )


            simplified = cv2.approxPolyDP(
                contour,
                epsilon,
                True
            )


            pts = " ".join(
                [
                    f"{p[0][0]},{p[0][1]}"
                    for p in simplified
                ]
            )


            svg_parts.append(
                f'<polygon '
                f'points="{pts}" '
                f'fill="none" '
                f'stroke="black" '
                f'stroke-width="{max(stroke_width,5)}" '
                f'stroke-linejoin="round"/>'
            )



        # Simplified tactile paths
        for path in paths:

            if len(path) < 2:
                continue


            d = (
                f"M {path[0][0]} {path[0][1]} "
                +
                " ".join(
                    [
                        f"L {x} {y}"
                        for x,y in path[1:]
                    ]
                )
            )


            svg_parts.append(
                f'<path '
                f'd="{d}" '
                f'fill="none" '
                f'stroke="black" '
                f'stroke-width="{max(stroke_width-1,3)}" '
                f'stroke-linecap="round"/>'
            )



        # OCR labels
        for label in labels:

            x,y,w,h = label["bbox"]


            svg_parts.append(
                f'<text '
                f'x="{x}" '
                f'y="{y+h+8}" '
                f'font-size="18" '
                f'font-family="Arial" '
                f'fill="black">'
                f'{label["text"]}'
                f'</text>'
            )



        svg_parts.append(
            "</svg>"
        )


        svg_str = "\n".join(
            svg_parts
        )



        # ---------------- PNG ----------------

        img = np.ones(
            (height,width,3),
            dtype=np.uint8
        ) * 255



        # Regions
        for r in regions:

            contour = np.array(
                r["contour"],
                dtype=np.int32
            )


            if len(contour) < 3:
                continue


            contour = contour.reshape(
                (-1,1,2)
            )


            cv2.polylines(
                img,
                [contour],
                True,
                (0,0,0),
                max(stroke_width,5),
                lineType=cv2.LINE_AA
            )



        # Paths
        for path in paths:

            if len(path) < 2:
                continue


            pts = np.array(
                path,
                dtype=np.int32
            ).reshape(
                (-1,1,2)
            )


            cv2.polylines(
                img,
                [pts],
                False,
                (0,0,0),
                max(stroke_width-1,3),
                lineType=cv2.LINE_AA
            )



        # Labels
        for label in labels:

            x,y,w,h = label["bbox"]


            cv2.putText(
                img,
                label["text"],
                (x,y+h+10),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.45,
                (0,0,0),
                1,
                cv2.LINE_AA
            )



        png_b64 = (
            "data:image/png;base64,"
            +
            encode_image(img)
        )


        metadata = {
            "regions": len(regions),
            "paths": len(paths),
            "labels": len(labels)
        }


        return svg_str, png_b64, metadata