import React, { useEffect, useState } from "react";
import "./Coin.css";
import { Button } from "web3uikit";
import { useWeb3ExecuteFunction, useMoralis } from "react-moralis";


const Coin = ({percentage, setPersentage, token, setModalToken, setVisible}) => {
    const [color, setColor] = useState();
    const contractProcessor = useWeb3ExecuteFunction();
    const { isAuthenticated } = useMoralis();

    useEffect( () => {
        if (percentage < 50) {
            setColor("#c43d08");
        } else {
            setColor("green");
        }
    }, [percentage]);

    async function vote(upDown){
        let options = {
            contractAddress: "0x5d81FE8773b9c0E5e8DbE830d46402203819bcAb",
            functionName: "vote",
            abi: [{
                "inputs": [
                  {
                    "internalType": "string",
                    "name": "_ticker",
                    "type": "string"
                  },
                  {
                    "internalType": "bool",
                    "name": "_vote",
                    "type": "bool"
                  }
                ],
                "name": "vote",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
              }],
            params: {_ticker: token, _vote: upDown}
        }

        await contractProcessor.fetch({
            params: options,
            onSuccess: () => {
              console.log("vote succesful");
            },
            onError: (error) => {
              alert(error.data.message)
            }
          });
    }

    return(
        <div>
            <div className="token">
                {token}
            </div>
            <div className="circle" style={{boxShadow: `0 0 20px ${color}`}}>
                <div className="wave" 
                    style={{
                        marginTop: `${100-percentage}%`,
                        boxShadow: `0 0 20px ${color}`, 
                        backgroundColor: color,
                    }}
                ></div>
                <div className="percentage">
                    {percentage}%
                </div>
            </div>

            <div className="votes">
                    <Button 
                        text="Up" 
                        theme="primary" 
                        type="button" 
                        onClick={ () => {
                            if(isAuthenticated){
                              vote(true)
                            }else{
                              alert("Authenicate to Vote")
                            }} }/>
                    
                    <Button 
                        text="Down" 
                        theme="colored" 
                        type="button"
                        color="red" 
                        onClick={ () => {
                            if(isAuthenticated){
                              vote(false)
                            }else{
                              alert("Authenicate to Vote")
                            }} }/>
            </div>
            <div className="votes">
                    <Button 
                        text="INFO" 
                        theme="translucent" 
                        type="button" 
                        onClick={ ()=>{setModalToken(token); setVisible(true)} }/>
            </div>
        </div>
    )
}

export default Coin;