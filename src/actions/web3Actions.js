
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import { WEB3_CONNECTED, WEB3_ERROR, } from "./types";
// import { getImages } from "./imageActions";
import ImageRegisterContractArtifact from "../contracts/abis/ImageGallery.json";

const CeloIPFSImageGalleryAddress =
  "0x7B04B2542767993723C603Cbc54956e89dc4b674";
 
export const web3Connect = () => async (dispatch, getState) => {
  try {
    if (window.celo) { 
      await window.celo.enable();

      const web3 = new Web3(window.celo);
      let kit = newKitFromWeb3(web3);

      const accounts = await kit.web3.eth.getAccounts();
      kit.defaultAccount = accounts[0];

      // deployed contract
      let contract = new kit.web3.eth.Contract(
        ImageRegisterContractArtifact,
        CeloIPFSImageGalleryAddress
      );

      dispatch({
        type: WEB3_CONNECTED,
        payload: {
          web3,
          contractInstance: contract,
          account: kit.defaultAccount.toLowerCase(),
          loading: false,
        },
      });
      // start watching the contract events

      // contract.once(
      //   "LogImageUploaded",
      //   {},
      //   {
      //     fromBlock: 6523028,
      //     toBlock: "latest",
      //   },
      //   function (error, event) {
      //     if (error) {
      //       console.log("LogImageUploaded event ERR", error);
      //       dispatch({
      //         type: WEB3_ERROR,
      //         payload: {
      //           loading: false,
      //           error,
      //         },
      //       });
      //     } else {
      //       console.log("LogImageUploaded event", event);
      //       dispatch(getImages());
      //     }
      //   }
      // );

  
    } 


  } catch (error) {
    // unable to load the contract
    const errorMessage = `Error loading 'ImageRegister' contract. Be sure Celo wallet is connected to a network and the contract is deployed. ERR: ${error.message}`;
    console.log(errorMessage);
    dispatch({
      type: WEB3_ERROR,
      payload: {
        loading: false,
        error: errorMessage,
      },
    });
  }
};

