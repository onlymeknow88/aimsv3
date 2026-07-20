import sys
import fitz  # PyMuPDF

def apply_transparent_watermark(page, watermark_image_path, opacity=0.25):
    """
    Apply a centered, semi-transparent watermark image to a PDF page using PyMuPDF.
    opacity: 0.0 = fully transparent, 1.0 = fully opaque. Default 0.25 (25% opacity).
    """
    rect = page.rect
    page_w = rect.width
    page_h = rect.height

    # Load image as Pixmap to get native dimensions
    try:
        pix = fitz.Pixmap(watermark_image_path)
        img_w = pix.width
        img_h = pix.height
    except Exception as e:
        print(f"Warning: could not read watermark dimensions: {e}")
        img_w = 400
        img_h = 200

    # Scale based on orientation (portrait vs landscape)
    is_landscape = page_w > page_h
    if is_landscape:
        max_w = page_w * 0.60
        max_h = page_h * 0.60
    else:
        max_w = page_w * 0.70
        max_h = page_h * 0.70

    w = float(img_w)
    h = float(img_h)
    if w > max_w or h > max_h:
        scale = min(max_w / w, max_h / h)
        w = w * scale
        h = h * scale

    # Center on page (visual coordinates)
    x0 = (page_w - w) / 2.0
    y0 = (page_h - h) / 2.0
    x1 = x0 + w
    y1 = y0 + h
    dest_rect = fitz.Rect(x0, y0, x1, y1)

    # Map visual coordinates to the unrotated coordinate system used by page.insert_image
    dest_rect = dest_rect * page.derotation_matrix

    # Insert image with alpha (transparency) control
    try:
        src_pix = fitz.Pixmap(watermark_image_path)

        # Ensure the pixmap has an alpha channel
        if src_pix.alpha == 0:
            src_pix = fitz.Pixmap(src_pix, 1)

        # Scale existing alpha values by desired opacity
        n = src_pix.n  # should be 4 (RGBA)
        samples = bytearray(src_pix.samples)
        for i in range(3, len(samples), n):
            samples[i] = int(samples[i] * opacity)

        alpha_bytes = bytes(samples[3::n])
        src_pix.set_alpha(alpha_bytes)

        comp_rotate = page.rotation
        page.insert_image(dest_rect, pixmap=src_pix, keep_proportion=True, overlay=True, rotate=comp_rotate)

    except Exception as e:
        print(f"Warning: transparent watermark failed ({e}), falling back to direct insert")
        comp_rotate = page.rotation
        page.insert_image(dest_rect, filename=watermark_image_path, keep_proportion=True, overlay=True, rotate=comp_rotate)


def main():
    if len(sys.argv) < 5:
        print("Usage: watermark.py <input_pdf> <output_pdf> <watermark_image> <mode>")
        sys.exit(1)

    input_pdf       = sys.argv[1]
    output_pdf      = sys.argv[2]
    watermark_image = sys.argv[3]
    mode            = sys.argv[4]  # 'rooting' or 'review'

    WATERMARK_OPACITY = 0.15

    try:
        doc = fitz.open(input_pdf)
    except Exception as e:
        print(f"Error opening source PDF: {e}")
        sys.exit(1)

    for page in doc:
        apply_transparent_watermark(page, watermark_image, opacity=WATERMARK_OPACITY)

    try:
        doc.save(output_pdf)
        doc.close()
        print("Success")
    except Exception as e:
        print(f"Error saving output PDF: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()