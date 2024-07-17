import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const fanRef = doc(db, "fan", "vv9DGF4kbnJbetb01QrK");

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Header = styled.header`
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 24px;
`;

const FanWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  margin-top: 60px;
  img {
    position: absolute;
    top: 0;
  }
  .fanTop {
    z-index: 3;
  }
  .fanMid {
    z-index: 2;
    top: 14px;
    animation: spin ${(props) => 1 / props.power}s linear infinite;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }
  .fanBottom {
    z-index: 1;

    top: 130px;
  }
`;

const BtnWrapper = styled.div`
  width: 100%;
  max-width: 412px;
  border: 2px solid #685a1c;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 24px;
  position: absolute;
  bottom: 100px;
`;

const Button = styled.button`
  background-color: #e9e9e9;
  position: relative;
  width: 40px;
  height: 36px;
  border-radius: 6px 6px 0 0;
  border: none;
  position: relative;
  transition: all 0.1s linear;
  &::after {
    content: "";
    width: 2px;
    height: 30px;
    background-color: #878787;
    position: absolute;
    display: block;
    bottom: 0;
    right: 0;
    transition: all 0.1s linear;
  }
  &::before {
    content: "";
    width: 2px;
    height: 30px;
    background-color: #878787;
    position: absolute;
    display: block;
    bottom: 0;
    left: 0;
    transition: all 0.1s linear;
  }
  span {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 6px;
    border-radius: 6px 6px 0 0;
    background-color: #878787;
    transition: all 0.1s linear;
  }
  .icon {
    width: 100%;
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
    div {
      width: 4px;
      height: 10px;
      border-radius: 2px;
      background-color: #222;
    }
  }
  &.active {
    height: 13px;
    &::after,
    &::before {
      height: 7px;
    }
    .icon {
      display: none;
    }
  }
`;

const Bullet = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 16px;
  background-color: #685a1c;
  position: absolute;
  &.one {
    top: 14px;
    left: 14px;
  }
  &.two {
    top: 14px;
    right: 14px;
  }
  &.three {
    bottom: 14px;
    left: 14px;
  }
  &.four {
    bottom: 14px;
    right: 14px;
  }
`;

const Button2nd = styled(Button)``;

const Button3rd = styled(Button)``;

const Button4th = styled(Button)`
  background-color: #e63333;
  &::after,
  &::before {
    background-color: #810e0e;
  }
  span {
    background-color: #810e0e;
  }
  .icon {
    div {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      background-color: #fff;
    }
  }
`;

const Logout = styled.button`
  width: 100%;
  max-width: 100px;
  border-radius: 24px;
  height: 34px;
  background-color: #222;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: all 0.1s linear;
  &:hover {
    background-color: #fff;
    color: #222;
  }
`;

const FanInfos = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 70px;
`;

export default function Home() {
  const navigate = useNavigate();
  const [fanInfo, setFanInfo] = useState("");
  const [lastUser, setLastUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState("");

  const fetchFan = async () => {
    setLoading(true);
    try {
      const fanQuery = query(collection(db, "fan"));
      await onSnapshot(fanQuery, (snapshot) => {
        const powers = snapshot.docs.map((doc) => doc.data().power);
        const lastUser = snapshot.docs.map((doc) => doc.data().lastUser);
        setFanInfo(powers);
        setLastUser(lastUser);
        setActiveIndex(powers);
      });
    } catch (error) {
      console.error("Error fetching fan info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFan();
  }, []);

  useEffect(() => {
    setActiveIndex(fanInfo);
  }, [fanInfo]);

  const handleFanPower = async (e) => {
    try {
      const userName = auth.currentUser.displayName;
      updateDoc(fanRef, { power: e, lastUser: userName });
    } catch (e) {
      console.log(e);
    }
  };

  const logOut = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <Wrapper>
      <Header>
        <Logout onClick={logOut}>Log out</Logout>
      </Header>
      <FanWrapper power={fanInfo === null ? 0 : fanInfo}>
        <img className="fanTop" src="/src/assets/fan_top.png"></img>
        <img className="fanMid" src="/src/assets/fan_mid.png"></img>
        <img className="fanBottom" src="/src/assets/fan_bottom.png"></img>
      </FanWrapper>
      <BtnWrapper>
        <Button4th
          className={activeIndex[0] === 0 ? "active" : null}
          onClick={() => handleFanPower(0)}
        >
          <span></span>
          <div className="icon">
            <div></div>
          </div>
        </Button4th>
        <Button
          className={activeIndex[0] === 1 ? "active" : null}
          onClick={() => handleFanPower(1)}
        >
          <span></span>
          <div className="icon">
            <div></div>
          </div>
        </Button>
        <Button2nd
          className={activeIndex[0] === 2 ? "active" : null}
          onClick={() => handleFanPower(2)}
        >
          <span></span>
          <div className="icon">
            <div></div>
            <div></div>
          </div>
        </Button2nd>
        <Button3rd
          className={activeIndex[0] === 5 ? "active" : null}
          onClick={() => handleFanPower(5)}
        >
          <span></span>
          <div className="icon">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </Button3rd>
        <Bullet className="one" />
        <Bullet className="two" />
        <Bullet className="three" />
        <Bullet className="four" />
      </BtnWrapper>
      {loading ? (
        <span>로딩 중...</span>
      ) : (
        <>
          {fanInfo ? (
            <FanInfos>
              <span>
                {lastUser} 님이 {fanInfo == 5 ? "3" : fanInfo}단계를 눌렀습니다.
              </span>
            </FanInfos>
          ) : null}
        </>
      )}
    </Wrapper>
  );
}
