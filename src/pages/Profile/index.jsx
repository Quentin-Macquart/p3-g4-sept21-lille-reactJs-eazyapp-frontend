import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { api } from 'conf';
import UserAvatar from 'components/UserAvatar';
import logo from 'assets/Img/easyApp.png';
import logoDark from 'assets/Img/easyAppDark.png';
import applePay from 'assets/Img/Apple_Pay_logo.svg';
import cb from 'assets/Img/logo-cb.svg';
import larrondi from 'assets/Img/LARRONDI.svg';
import home from 'assets/Img/home.svg';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import ToggleButton from 'components/ToggleButton';
import SProfile from './style';
import RefillModal from './RefillModal';
import Meetings from './Meetings';
import GiftModal from './GiftModal';

export default function Profile({ theme, setTheme }) {
  const [orderRecap, setOrderRecap] = useState([]);
  const [quantityRecap, setQuantityRecap] = useState([]);
  const isDarkTheme = theme === 'dark';
  const toggleTheme = () => {
    return setTheme(isDarkTheme ? 'light' : 'dark');
  };
  const user = useSelector((state) => state.user);
  const { id } = user;
  const [refillModal, setRefillModal] = useState(true);
  const toggleModal = () => {
    setRefillModal(!refillModal);
  };
  const [giftModal, setGiftModal] = useState(true);
  const toggleGiftModal = () => {
    setGiftModal(!giftModal);
  };

  useEffect(() => {
    api.get(`/supplies/${id}/myOrder`).then(({ data }) => {
      setOrderRecap(data.orderRecap);
      setQuantityRecap(data.quantityRecap);
    });
  }, []);

  const [myMeal, setMyMeal] = useState([]);
  useEffect(() => {
    api.get(`user/${id}/myMeal`).then(({ data }) => {
      setMyMeal(data);
    });
  }, []);

  return (
    <SProfile>
      <div className="profilCard">
        <div className="head">
          <Link to="/home">
            <img src={home} alt="homeIcon" />
          </Link>
          <ToggleButton
            label="Dark/light mode"
            handleClick={toggleTheme}
            className={isDarkTheme ? 'dark' : null}
            size={0.75}
          />
        </div>
        <img src={isDarkTheme ? logoDark : logo} alt="homeIcon" />
        <div className="userCard">
          <UserAvatar size="125px" border="none" />
          <h2>
            {user.firstname} {user.lastname}
          </h2>
          <p>{user.job}</p>
        </div>
      </div>
      <article className="solde">
        <h3>Solde : {user.amount} € </h3>
        <div className="refill">
          <button type="button" className="money" onClick={toggleModal}>
            Recharger
          </button>
          <button type="button" className="money" onClick={toggleGiftModal}>
            Donner
          </button>
        </div>
        <div className="paymentLogo">
          <img src={cb} alt="CB" />
          <img src={applePay} alt="apple pay" />
          <img src={larrondi} alt="l&#39;arrondi" />
        </div>
      </article>
      <article className="resume">
        <h2>Mes reservations</h2>
        <p>Recapitulatif des reservations en cours ...</p>
      </article>
      <Meetings />
      <article className="orders">
        <h2>Mes commandes</h2>
        <div className="mainContainer">
          <div className="quantity">
            {quantityRecap.map((qtty) => {
              return <p>x {qtty.quantity}</p>;
            })}
          </div>
          <section>
            {orderRecap.map((order) => {
              return (
                <div className="orderRecap">
                  <p>{order.name}</p>
                  <img src={order.picture} alt={`${order.name} photography`} />
                </div>
              );
            })}
          </section>
        </div>
      </article>
      <article className="resume">
        <h2>Votre repas</h2>
        <ul>
          {myMeal.map((meal) => {
            return (
              <li>
                <div>
                  <img src={meal.picture} alt="foodPicture" />
                </div>
                <p>{meal.name}</p>
              </li>
            );
          })}
        </ul>
      </article>
      {!refillModal && <RefillModal toggleModal={toggleModal} />}
      {!giftModal && <GiftModal toggleGiftModal={toggleGiftModal} />}
    </SProfile>
  );
}

Profile.propTypes = {
  theme: PropTypes.string,
  setTheme: PropTypes.func,
};

Profile.defaultProps = {
  theme: '',
  setTheme: () => {},
};
