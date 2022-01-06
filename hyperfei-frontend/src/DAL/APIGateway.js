
const API_URL = "http://127.0.0.1:8000";
const TEST_URL = `${API_URL}/active`
const POST_IMAGE_URL = `${API_URL}/transform`

export function getActiveRoute() {
    return fetch(TEST_URL).then(res => res.json());
}

export function postSelectedImage(base64Data) {
    const options = {
        method: 'POST',
        body: JSON.stringify({"imgDataBase64": base64Data}),
        headers: {
          'Content-Type': 'application/json'
        }
      };
    return fetch(POST_IMAGE_URL, options).then(res => {
      if (res.status >= 400 && res.status < 600) {
        if (res.status == 500) {
          console.log(res);
          throw new Error("Unable to detect face");
        }
        throw new Error("Bad response from server");
      }
      return res.json();
    // }).then(res => URL.createObjectURL(res));
    }).then(res => console.log(res));
}