
// const API_URL = "http://127.0.0.1:9000";
const API_URL = process.env.REACT_APP_API_URL;
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
        if (res.status === 500) {
          throw new Error("Whoops! We are unable to detect face, please try again.", { cause: 'Face' });
        }
        throw new Error("Whoops! Bad response from server. This is bad. Admin needed.", { cause: 'Server' });
      }
      return res.json();
    });
}


export function postSelectedImageFake(base64Data) {
  return new Promise(() => {
    return {
      'GeneratorTypes.TOONIFY': base64Data,
      'GeneratorTypes.PIXAR': base64Data,
      'GeneratorTypes.SKETCH': base64Data,
      'GeneratorTypes.DISNEY_PRINCESS': base64Data
    };
  });
}

export function postSelectedImageFail(base64Data) {
  return new Promise(() => {
    return {
      'status': 500
    };
  }).then(t => {
    throw new Error("Unable to detect face");
  });
}