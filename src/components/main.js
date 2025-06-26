import React from "react";
import html2canvas from "html2canvas";
import "../styles.css";
import Meme from "../images/meme.jpg";
export default function Main() {
  const [meme, setMeme] = React.useState({
    topText: "TOP TEXT",
    bottomText: "BOTTOM TEXT",
    imageUrl: Meme,
    isCustomImage: false,
  });

  // fetching memes from api
  const [allMemes, setAllMemes] = React.useState([]);

  React.useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setAllMemes(data.data.memes));
  }, []);

  // setting color of span text
  const [textColor, setTextColor] = React.useState("#ffffff");

  // updating topline and bottom line from input
  function handleChange(event) {
    const { value, name } = event.currentTarget;
    setMeme((prevMeme) => ({
      ...prevMeme,
      [name]: value,
    }));
  }

  // meme download area
  const memeRef = React.useRef(null);
  const downloadMeme = async () => {
    const memeElement = memeRef.current;
    if (!memeElement) return;

    // Wait a little to ensure everything (like image) is loaded
    setTimeout(async () => {
      const canvas = await html2canvas(memeElement, {
        useCORS: true,
      });
      const image = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.href = image;
      link.download = "my-meme.png";
      link.click();
    }, 300); // wait for 300ms
  };

  function getMemeImage() {
    if (meme.isCustomImage) {
      setMeme((prevMeme) => ({
        ...prevMeme,
        isCustomImage: false, // switch back to API memes
      }));
    }

    const randonNumber = Math.floor(Math.random() * allMemes.length);
    const newMemeUrl = allMemes[randonNumber].url;
    setMeme((prevMeme) => ({
      ...prevMeme,
      imageUrl: newMemeUrl,
    }));
  }

  const [uploadedFileName, setUploadedFileName] = React.useState("");

  // image update alert
  const [uploadMessage, setUploadMessage] = React.useState("");
  const [showAlert, setShowAlert] = React.useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setMeme((prevMeme) => ({
        ...prevMeme,
        imageUrl,
        isCustomImage: true,
      }));

      // Set alert
      setUploadMessage(`Uploaded: ${file.name}`);
      setShowAlert(true);

      // Auto-hide after 1 second
      setTimeout(() => {
        setShowAlert(false);
      }, 10000);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <main>
      <div className="form">
        <div className="inputs">
          <label htmlFor="">
            Top Text
            <input
              type="text"
              onChange={handleChange}
              placeholder="One does not simply"
              name="topText"
              value={meme.topText}
            />
          </label>

          <label htmlFor="">
            Bottom Text
            <input
              onChange={handleChange}
              type="text"
              placeholder="Walk into modor"
              name="bottomText"
              value={meme.bottomText}
            />
          </label>
        </div>
        <div className="meme_color">
          <button onClick={getMemeImage} className="gen-btn">
            Get a new meme image
          </button>

          <div className="textColor">
            <label>
              Text Color:
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="meme" ref={memeRef}>
        <img
          src={meme.imageUrl}
          alt="Meme"
          className="memeimg"
          crossOrigin="anonymous"
        />
        <span className="top" style={{ color: textColor }}>
          {meme.topText}
        </span>
        <span className="bottom" style={{ color: textColor }}>
          {meme.bottomText}
        </span>
      </div>

      <div className="upload-download">
        <label htmlFor="file-upload" className="custom-upload-label">
          Upload Image
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="upload-btn"
        />

        <button onClick={downloadMeme} className="download-btn">
          Download Meme
        </button>
      </div>
      {showAlert && (
        <div className="upload-alert">
          <span>{uploadMessage}</span>
          <button className="close-btn" onClick={handleCloseAlert}>
            ×
          </button>
        </div>
      )}
    </main>
  );
}
