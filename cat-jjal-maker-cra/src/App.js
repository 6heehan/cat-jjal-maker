import './App.css';
import React from 'react';
import Title from './components/Title';

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

console.log("야옹");

function CatItem(props) {
  return (
    <li>
      <img
        src={props.img}
      //style={{ width: "150px", border: "1px solid red" }}
      />
    </li>
  )
}


const Form = ({ updateMainCat }) => {
  // const counterState = React.useState(1);
  // const counter = counterState[0];
  // const setCounter = counterState[1];

  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  function handleInputChange(e) {
    const userValue = e.target.value;
    //console.log(includesHangul(userValue));
    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다");
    }
    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    if (value === "") {
      setErrorMessage("빈 값으로 만들 수 없습니다.");
      return;
    }

    updateMainCat(value);
  }

  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성</button>
      <p style={{ color: 'red' }}>{errorMessage}</p>
    </form>
  )
}

const MainCard = (props) => {
  const heartIcon = props.alreadyFavorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={props.img} />
      <button onClick={props.onHeartClick} >{heartIcon}</button>
    </div>
  )
};

function Favorites({ favorites }) {

  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>
  }

  return (
    <ul className="favorites">
      {favorites.map(cat => <CatItem img={cat} key={cat} />)}
    </ul>
  )
};

const App = () => {
  const CAT1 = "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
  // const CAT2 = "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
  // const CAT3 = "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem('counter');
  });
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem('favorites') || [];
  });
  const [mainCardImg, setMainCardImg] = React.useState(CAT1);

  // const [counter, setCounter] = React.useState(jsonLocalStorage.getItem('counter'));
  /* const [favorites, setFavorites] = React.useState(
    jsonLocalStorage.getItem('favorites') || []
  ); */

  const alreadyFavorite = favorites.includes(mainCardImg);

  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    setMainCardImg(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, [])


  React.useEffect(() => {
    console.log("헬로");
  }, [counter])

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setMainCardImg(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem('counter', nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCardImg];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem('favorites', nextFavorites);
  }

  const counterHasValue = counter === null;
  console.log(counterHasValue);
  const title = counterHasValue ? "" : counter + "번째 ";

  return (
    <div>
      <Title>{title}고양이 가사라대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard img={mainCardImg} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
      <Favorites favorites={favorites} />
    </div>
  );
};


export default App;
