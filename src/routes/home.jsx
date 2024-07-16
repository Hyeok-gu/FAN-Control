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

const fanRef = doc(db, "fan", "vv9DGF4kbnJbetb01QrK");

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const FanWrapper = styled.div``;

const Fan = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  animation: spin ${(props) => 1 / props.power}s linear infinite;
  &::before {
    content: "";
    display: block;
    width: 100%;
    height: 10px;
    background-color: #222;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &::after {
    content: "";
    display: block;
    width: 10px;
    height: 100%;
    background-color: #222;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const BtnWrapper = styled.div``;

const Button = styled.button`
  width: 100px;
  height: 100px;
  background-color: #eee;
  color: #222;
  &.active {
    background-color: red !important;
  }
`;

const Button2nd = styled(Button)`
  background-color: aliceblue;
`;

const Button3rd = styled(Button)`
  background-color: greenyellow;
`;

const Button4th = styled(Button)`
  background-color: darkcyan;
`;

const Logout = styled.button`
  max-width: 100px;
  border-radius: 24px;
  height: 34px;
  background-color: #eee;
  border: none;
  color: #222;
  cursor: pointer;
  transition: all 0.2s linear;
  &:hover {
    background-color: #ddd;
  }
`;

export default function Home() {
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

  const logOut = () => {
    auth.signOut();
  };

  return (
    <Wrapper>
      <Logout onClick={logOut}>Log out</Logout>
      <FanWrapper>
        <Fan power={fanInfo === null ? 0 : fanInfo} />
      </FanWrapper>
      <BtnWrapper>
        <Button4th
          className={activeIndex[0] === 0 ? "active" : null}
          onClick={() => handleFanPower(0)}
        >
          멈춤
        </Button4th>
        <Button
          className={activeIndex[0] === 1 ? "active" : null}
          onClick={() => handleFanPower(1)}
        >
          미풍
        </Button>
        <Button2nd
          className={activeIndex[0] === 3 ? "active" : null}
          onClick={() => handleFanPower(3)}
        >
          약풍
        </Button2nd>
        <Button3rd
          className={activeIndex[0] === 5 ? "active" : null}
          onClick={() => handleFanPower(5)}
        >
          강풍
        </Button3rd>
      </BtnWrapper>
      {loading ? (
        <span>로딩 중...</span>
      ) : (
        <>
          {fanInfo ? (
            <div>
              <span>선풍기 세기: {fanInfo}</span>
              <span>마지막 누른 사람: {lastUser}</span>
            </div>
          ) : null}
        </>
      )}
    </Wrapper>
  );
}
