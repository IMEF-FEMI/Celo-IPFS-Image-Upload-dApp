import { keyBy } from "lodash";

import { ipfs } from "../utils/ipfs";

import {
  GET_IMAGES,
  GET_IMAGES_SUCCESS,
  GET_IMAGE,
  UPLOAD_IMAGE,
  UPLOAD_IMAGE_SUCCESS,
  SET_ERROR,
} from "./types";

// Get all images
export const getImages = () => async (dispatch, getState) => {
  dispatch({ type: GET_IMAGES });

  const web3State = getState().web3;

  // Retrieve image state from local storage
  const localData = localStorage.getItem(web3State.account);
  const localImages = localData ? JSON.parse(localData) : [];
  const imagesByIndex = keyBy(localImages, "index");

  const images = [];
  try {
    const count = await web3State.contractInstance.methods
      .getImageCount(web3State.account)
      .call();

    const imageCount = parseInt(count);

    for (let index = 0; index < imageCount; index++) {
      const imageResult = await web3State.contractInstance.methods
        .getImage(web3State.account, index)
        .call();

      // Image for UI
      const image = {
        ...imagesByIndex[index],
        index,
        ipfsHash: imageResult[0],
        title: imageResult[1],
        description: imageResult[2],
        tags: imageResult[3],
        uploadedOn: convertTimestampToString(imageResult[4]),
      };
      images.push(image);
    }

    // Save image state to local storage
    localStorage.setItem(web3State.account, JSON.stringify(images));

    dispatch({ type: GET_IMAGES_SUCCESS, payload: images });
  } catch (error) {
    console.log("error", error);
    dispatch({ type: SET_ERROR, payload: error });
  }
};

// upload an image
export const uploadImage =
  (buffer, title, description, tags, history) => async (dispatch, getState) => {
    dispatch({ type: UPLOAD_IMAGE });

    // Add image to IPFS
    ipfs.files.add(buffer, async (error, result) => {
      if (error) {
        console.log("ERR", error);
        dispatch({
          type: SET_ERROR,
          payload: {
            error,
          },
        });
      } else {
        const ipfsHash = result[0].hash; // base58 encoded multihash
        ipfs.files.get(ipfsHash, (error, files) => {
          console.log(files);
        });

        const web3State = getState().web3;
        const contractInstance = web3State.contractInstance;
        try {
          // Success, upload IPFS and metadata to the blockchain
          const txReceipt = await contractInstance.methods
            .uploadImage(ipfsHash, title, description, tags)
            .send({
              from: web3State.account,
            });

          console.log("uploadImage tx receipt", txReceipt);

          const {
            blockHash,
            blockNumber,
            transactionHash,
            transactionIndex,
            cumulativeGasUsed,
            gasUsed,
          } = txReceipt;

          // Determine index based on length of images array; otherwise,
          // would need to call contract to get length
          const count = await web3State.contractInstance.methods
            .getImageCount(web3State.account)
            .call();

          const index = parseInt(count);
          const newImage = {
            index,
            ipfsHash,
            title,
            description,
            tags,
            uploadedOn: "Pending",
            blockHash,
            blockNumber,
            transactionHash,
            transactionIndex,
            cumulativeGasUsed,
            gasUsed,
          };

          // Update persisted state in local storage
          const localData = localStorage.getItem(web3State.account);
          const localImages = localData ? JSON.parse(localData) : [];
          localImages.push(newImage);
          localStorage.setItem(web3State.account, JSON.stringify(localImages));

          getImages()
          dispatch({
            type: UPLOAD_IMAGE_SUCCESS,
            payload: newImage,
          });

          history.push("/");
        } catch (error) {

          console.log("ERR", error);
          dispatch({
            type: SET_ERROR,
            payload: {
              error,
            },
          });
          throw error;
        }
      }
    });
  };

// Get image by index
export const getImage = (index) => ({ type: GET_IMAGE, payload: index });

const convertTimestampToString = (timestamp) => {
  let tempDate = Number(timestamp);
  return tempDate !== 0 ? new Date(tempDate * 1000).toString() : null;
};
