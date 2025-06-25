import React from "react";
import "../styles.css";
import Meme from "../images/meme.jpg";
export default function Main() {
  const [meme, setMeme] = React.useState({
    topText: "Upar Wali Line",
    bottomText: "lund Wali Line",
    imageUrl: Meme,
  });
  // fetching memes from api
  const [allMemes, setAllMemes] = React.useState([]);

  React.useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setAllMemes(data.data.memes));
  }, []);

  // generating random meme form api
  function getMemeImage() {
    const randonNumber = Math.floor(Math.random() * allMemes.length);
    const newMemeUrl = allMemes[randonNumber].url;
    setMeme((prevMeme) => ({
      ...prevMeme,
      imageUrl: newMemeUrl,
    }));
  }

  // updating topline and bottom line from input
  function handleChange(event) {
    const { value, name } = event.currentTarget;
    setMeme((prevMeme) => ({
      ...prevMeme,
      [name]: value,
    }));
  }

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
        <button onClick={getMemeImage} className="gen-btn">
          Get a new meme image
        </button>
      </div>

      <div className="meme">
        <img
          className="memeimg"
          name="image"
          src={meme.imageUrl}
          alt="memeImage"
        />
        <span className="top">{meme.topText}</span>
        <span className="bottom">{meme.bottomText}</span>
      </div>
    </main>
  );
}
