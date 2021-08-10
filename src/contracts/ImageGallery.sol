// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;


contract ImageRegister {

    /** 
    * @title Represents a single image which is owned by someone. 
    */
    struct Image {
        string ipfsHash;        // IPFS hash
        string title;           // Image title
        string description;     // Image description
        string tags;            // Image tags in comma separated format
        uint256 uploadedOn;     // Uploaded timestamp
    }

    // Maps owner to their images
    mapping (address => Image[]) public ownerToImages;

 
    event LogImageUploaded(
        address indexed _owner, 
        string _ipfsHash, 
        string _title, 
        string _description, 
        string _tags,
        uint256 _uploadedOn
    );
    // emit event when an image is updated
    
       event logImageEdited(
        address indexed _owner, 
        string _title, 
        string _description, 
        string _tags,
        //timestamp the image was updated 
        uint256 _updatedOn
    );

   function uploadImage(
        string memory _ipfsHash, 
        string memory  _title, 
        string memory _description, 
        string memory _tags
    ) public  returns (bool _success) {
            
        require(bytes(_ipfsHash).length == 46);
        require(bytes(_title).length > 0 && bytes(_title).length <= 256);
        require(bytes(_description).length < 1024);
        require(bytes(_tags).length > 0 && bytes(_tags).length <= 256);

        uint256 uploadedOn = block.timestamp;
        
        Image memory image = Image(
            _ipfsHash,
            _title,
            _description,
            _tags,
            uploadedOn
        ); 

        ownerToImages[msg.sender].push(image);

        emit LogImageUploaded(
            msg.sender,
            _ipfsHash,
            _title,
            _description,
            _tags,
            uploadedOn
        );

        _success = true;
    }
    

    /** 
    * @notice Returns the number of images associated with the given address
    * @dev Controlled by circuit breaker
    * @return The number of images associated with a given address
    */
    function getImageCount() public view returns (uint256) {
        return ownerToImages[msg.sender].length;
    }

    /** 
    * @notice Returns the image at index in the ownership array
    * @dev Controlled by circuit breaker
    * @param _index The index of the image to return
    * @return _ipfsHash The IPFS hash
    * @return _title The image title
    * @return _description The image description
    * @return _tags image Then image tags
    * @return _uploadedOn The uploaded timestamp
    */ 
    function getImage(uint8 _index) 
        public  view returns (
        string memory _ipfsHash, 
        string memory _title, 
        string memory _description, 
        string memory _tags,
        uint256 _uploadedOn
    ) {


        require(_index >= 0 && _index <= 2**8 - 1);
        // require(ownerToImages[_owner].length > 0);

        Image storage image = ownerToImages[msg.sender][_index];
        
        return (
            image.ipfsHash, 
            image.title, 
            image.description, 
            image.tags, 
            image.uploadedOn
        );
    }
    
          //owner of the image can update the image details
    function update(
    uint8 _index    , 
        string memory  _title, 
        string memory _description, 
        string memory _tags) 
    public returns (bool _success) {
        
        require(bytes(_title).length > 0 && bytes(_title).length <= 256);
        require(bytes(_description).length < 1024);
        require(bytes(_tags).length > 0 && bytes(_tags).length <= 256);
        ownerToImages[msg.sender][_index].title = _title;
        ownerToImages[msg.sender][_index].description = _description;
        ownerToImages[msg.sender][_index].tags = _tags;
            
        uint256 _updatedOn = block.timestamp;
     
            
        emit logImageEdited(msg.sender, _title, _description, _tags, _updatedOn);
        _success = true;
    }
    
    
    

}
