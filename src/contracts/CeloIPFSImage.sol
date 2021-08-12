// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 < 0.9.0;

/// @title A contract to store images on the CELO blockchain
/// @author devfemi, emmanueljet
/// @notice You can use this contract for only development purposes
/// @dev You can contribute to this contract to fix bugs or errors
/// @custom:experimental This is an experimental contract

contract CeloIPFSImage {

  /** 
  * @title Represents a single image which is owned by a user or shared with friends. 
  */
  struct Image {
    address owner;        // Image Owner
    string  tags;         // Image tags
    string  title;        // Image title
    string  ipfsHash;     // Image IPFS hash
    string  description;  // Image description
    uint256 createdAt;    // Image created on timestamp
    uint256 updatedAt;    // Image updated on timestamp
  }

  /**
  * @title Represents a single user account details
  * @author Emmanuel Joseph(JET)
  */
  struct Account {
    bool    exist;                              // Account found check
    address user;                               // Account user address
    uint256 imageCount;                         // Account images count
    mapping (uint256 => Image) userImages;      // Maps images to an identifier
    mapping (address => Image[]) sharedImages;  // Maps shared images to friend address 
  }

  /// @notice Maps account to an address identifier
  mapping (address => Account) internal users;

  /// @notice Logs Image based activities on upload and update
  event LogImageActivity(
    address indexed owner,
    string  tags,
    string  title,
    string  ipfsHash,
    string  description,
    uint256 createdAt,
    uint256 updatedAt
  );

  /**
  * @notice Ensure a user account status on the contract
  * @param _userAddress The intending wallet of the user
  */
  modifier verifyAccount(address _userAddress) {
    require(users[_userAddress].exist, "User not found");
    _;
  }

  /**
  * @notice Ensure the address utilizing an account based function is the user's
  * @param _owner The owner address
  */
  modifier accountOwner(address _owner) {
    require(users[_owner].exist, "User not found");
    require(msg.sender == users[_owner].user, "Error 401: Unauthorized User.");
    _;
  }

  /**
  * @notice Returns an account detail in the users map
  * @dev Uses the accountOwner modifier
  * @param _user The user address
  * @return owner The owner address
  * @return imageCount The owner image count
  */
  function getUserAccount(
    address _user
  ) public accountOwner(_user) view returns ( 
    address owner,
    uint256 imageCount
  ) {
    Account storage user = users[_user];

    return (
      user.user,
      user.imageCount
    );
  }

  /**
  * @notice Uploads an Image to a user account if found or create new user if not found
  * @dev Controlled by circuit breaker
  * @param _ipfsHash The intending to add Image IPFS hash
  * @param _title The intending to add Image title
  * @param _description The intending to add Image description
  * @param _tags The intending to add Image tags
  * @return success The image upload successful status
  */
  function uploadImage(
    string memory _ipfsHash, 
    string memory _title, 
    string memory _description, 
    string memory _tags
  ) public returns (bool success) {
    require(bytes(_ipfsHash).length == 46, "Invalid IPFS Hash");
    verifyImageParameters(_title, _description, _tags);

    uint256 currentDatetime = block.timestamp;
    Image memory newImage = Image(
      msg.sender,
      _tags,
      _title,
      _ipfsHash,
      _description,
      currentDatetime,
      currentDatetime
    );

    if (users[msg.sender].exist) {
      Account storage user = users[msg.sender];
      user.userImages[user.imageCount] = newImage;
      user.imageCount++;
    } else {
      Account storage newUser = users[msg.sender];
      newUser.exist = true;
      newUser.user = msg.sender;
      newUser.imageCount = 1;
      newUser.userImages[0] = newImage;
    }

    emit LogImageActivity(
      newImage.owner,
      newImage.tags,
      newImage.title,
      newImage.ipfsHash,
      newImage.description,
      newImage.createdAt,
      newImage.updatedAt
    );

    return (true);
  }

  /** 
  * @notice Returns the image at index in the Account userImages map
  * @dev Uses the accountOwner modifier
  * @param _index The index of the image to return
  * @param _owner The user owner address
  * @return tags image Then image tags
  * @return title The image title
  * @return ipfsHash The IPFS hash
  * @return description The image description
  * @return createdAt The image created at datetime
  * @return updatedAt The image updated at datetime
  */ 
  function getUserImage(
    uint256 _index,
    address _owner
  ) public accountOwner(_owner) view returns ( 
    string memory tags,
    string memory title,
    string memory ipfsHash, 
    string memory description,
    uint256 createdAt,
    uint256 updatedAt
  ) {
    require(_index >= 0 && _index <= 2**8 - 1);

    Image storage userImage = users[_owner].userImages[_index];
    
    return (
      userImage.tags,
      userImage.title,
      userImage.ipfsHash, 
      userImage.description,
      userImage.createdAt,
      userImage.updatedAt
    );
  }

  /**
  * @notice Updates a user account Image at index
  * @dev Uses the accountOwner modifier and emits the LogImageActivity event
  * @param _owner The user owner address
  * @param _index The index of the image to update
  * @param _title The intending to add Image title
  * @param _description The intending to add Image description
  * @param _tags The intending to add Image tags
  * @return success The image update successful status
  */
  function updateImage(
    address _owner,
    uint256 _index, 
    string memory  _title, 
    string memory _description, 
    string memory _tags
  ) public accountOwner(_owner) returns (bool success) {
    verifyImageParameters(_title, _description, _tags);

    uint256 currentDatetime = block.timestamp;

    Image storage userImage = users[_owner].userImages[_index];

    userImage.title = _title;
    userImage.description = _description;
    userImage.tags = _tags;
    userImage.updatedAt = currentDatetime;
  
    emit LogImageActivity(
      userImage.owner,
      userImage.tags,
      userImage.title,
      userImage.ipfsHash,
      userImage.description,
      userImage.createdAt,
      userImage.updatedAt
    );

    return (true);
  }

  /**
  * @notice Shares a user account Image at index to a friend account
  * @dev Uses the accountOwner and verifyAccount modifiers
  * @param _index The index of the image to share
  * @param _owner The user owner address
  * @param _friend The friend user address
  * @return success The image share successful status
  */
  function shareImage(
    uint256 _index,
    address _owner,
    address _friend
  ) public accountOwner(_owner) verifyAccount(_friend) returns (bool success) {
    Image storage userImage = users[_owner].userImages[_index];
    Account storage userFriend = users[_friend];

    userFriend.sharedImages[msg.sender].push(userImage);
    
    return (true);
  }

  /** 
  * @notice Returns the number of images associated with a given friend address
  * @dev Uses the verifyAccount modifier
  * @param _friend The friend address
  * @return length The number of images associated with a given friend address
  */
  function getSharedImageCount(
    address _friend
  ) public verifyAccount(msg.sender) view returns (uint256 length) {
    return (users[msg.sender].sharedImages[_friend].length);
  }

  /** 
  * @notice Returns the image at index in the Account sharedImages map
  * @dev Uses the accountOwner modifier
  * @param _index The index of the image to return
  * @param _owner The owner address
  * @param _friend The friend address
  * @return tags image Then image tags
  * @return title The image title
  * @return ipfsHash The IPFS hash
  * @return description The image description
  */ 
  function getSharedImage(
    uint256 _index,
    address _owner,
    address _friend
  ) public accountOwner(_owner) view returns ( 
    string memory tags,
    string memory title,
    string memory ipfsHash, 
    string memory description
  ) {
    require(_index >= 0 && _index <= 2**8 - 1);

    Account storage user = users[msg.sender];
    require(user.sharedImages[_friend].length > 0, "Shared Image not found");

    Image storage sharedImage = user.sharedImages[_friend][_index];
    
    return (
      sharedImage.tags,
      sharedImage.title,
      sharedImage.ipfsHash, 
      sharedImage.description
    );
  }

  /** 
  * @notice Verifies the parameter to add or update Image attributes
  * @dev Controlled by circuit breaker
  * @param _title The Image parameter title
  * @param _description The Image parameter description
  * @param _tags The Image parameter tags
  * @custom:message Ensure Image attributes pass the required test
  */ 
  function verifyImageParameters(
    string memory _title,
    string memory _description,
    string memory _tags
  ) internal pure {
    require(bytes(_title).length > 0 && bytes(_title).length <= 256, "Title character must be greater than 0 or less then 257");
    require(bytes(_description).length < 1024, "Description must be less than 1024 characters");
    require(bytes(_tags).length > 0 && bytes(_tags).length <= 256, "Tags character must be greater than 0 or less then 257");
  }
}