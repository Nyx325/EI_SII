import cv2

def process_image(img):
    print("A")
    cv2.imshow("Imagen recibida", img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()