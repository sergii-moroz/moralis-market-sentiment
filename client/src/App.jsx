import React, { useEffect, useState} from "react";
import './App.css';
import { ConnectButton, Modal } from "web3uikit";
import logo from "./images/Moralis.png";
import Coin from "./components/Coin";
import {abouts} from "./about";
import { useMoralisWeb3Api, useMoralis } from "react-moralis";

const App = () => {
  const [btc, setBTC] = useState(50);
  const [eth, setETH] = useState(38);
  const [link, setLINK] = useState(55);
  const [visible, setVisible] = useState(false);
  const [modalToken, setModalToken] = useState();
  const [modalPrice, setModalPrice] = useState();
  const Web3Api = useMoralisWeb3Api();
  const { Moralis, isInitialized } = useMoralis();

  async function getRatio(tick, setPersentage){
    const Votes = Moralis.Object.extend("Votes");
    const query = new Moralis.Query(Votes);
    query.equalTo("ticker", tick);
    query.descending("createdAt");
    const result = await query.first();
    let up = Number(result.attributes.up);
    let down = Number(result.attributes.down);
    let ratio = Math.round(up/(up+down)*100);
    setPersentage(ratio);
  }

  useEffect(() => {
    if(isInitialized){
      getRatio("BTC", setBTC);
      getRatio("ETH", setETH);
      getRatio("LINK", setLINK);

      async function createLiveQuery(){
        let query = new Moralis.Query('Votes');
        let subscription = await query.subscribe();
        subscription.on('update', (object) => {
          if(object.attributes.ticker === "LINK"){
            getRatio("LINK", setLINK);
          } else if (object.attributes.ticker === "ETH"){
            getRatio("ETH", setETH);
          } else if (object.attributes.ticker === "BTC"){
            getRatio("BTC", setBTC);
          }
        });
      }
      createLiveQuery();
    }
  }, [isInitialized]);


  useEffect(() => {
    async function fetchTokenPrice() {
      const options = {
        address:
          abouts[abouts.findIndex((x) => x.token === modalToken)].address,
      };
      const price = await Web3Api.token.getTokenPrice(options);
      setModalPrice(price.usdPrice.toFixed(2));
    }

    if(modalToken){
      fetchTokenPrice()
    }
  }, [modalToken]);

  return (
    <div className="App">
      <header className='header'>
        <div className="logo">
          <img src={logo} alt="logo" height="50px"/>
          Sentiment
        </div>
        <ConnectButton />
      </header>
      <div className="instructions">
        Where do you think these tokens are going? Up or Down?
      </div>

      <div className="list">
        <Coin percentage={btc} setPersentage={setBTC} token={"BTC"} setModalToken={setModalToken} setVisible={setVisible} />
        <Coin percentage={eth} setPersentage={setETH} token={"ETH"} setModalToken={setModalToken} setVisible={setVisible} />
        <Coin percentage={link} setPersentage={setLINK} token={"LINK"} setModalToken={setModalToken} setVisible={setVisible} />
      </div>

      <Modal
        isVisible={visible}
        hasFooter={false}
        title={modalToken}
        onCloseButtonPressed={()=>setVisible(false)}
      >
        <div>
          <span>{`Price: `}</span> {modalPrice}$
        </div>
        <div>
          <span style={{color: "red" }}>{'about'}</span>
        </div>
        <div>
          {modalToken && abouts[abouts.findIndex((x) => x.token === modalToken)].about}
        </div>
      </Modal>
      
    </div>
  )
}

export default App
