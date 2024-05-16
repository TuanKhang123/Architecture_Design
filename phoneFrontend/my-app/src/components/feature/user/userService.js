import axios from "axios";
// Gọi api thông qua axios


const loginUser = async ({ email, password }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(
    "http://localhost:8000/auth/user/login",
    {
      email: email,
      password: password,
    },
    config
  );
  localStorage.setItem("accessToken", response.data.accessToken);
  return response.data;
};

//Register
const registerUser = async ({ firstname, lastname, avatar, phonenumber, email, password }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(
    "http://localhost:8000/auth/user/register",
    {
      firstname: firstname,
      lastname: lastname,
      avatar: avatar[0]?.thumbUrl,
      phonenumber: phonenumber,
      email: email,
      password: password,
    },
    config
  );
  return response.data;
};

//forgot password
const forgotPassword = async ({ email }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post(
    "http://localhost:8000/auth/user/forgotpassword",
    {
      email: email,
    },
    config
  );
  return response.data;
};

//change password
const changePassword = async ({ password, retypeNewPassword }) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (password !== retypeNewPassword) {
    console.log("Password is not match");
  } else {
    const response = await axios.post(
      `http://localhost:8000/auth/user/changepassword/${window.location.href.substring(
        window.location.href.lastIndexOf("/") + 1
      )}`,
      {
        password: password,
      },
      config
    );
    console.log(response.data);
    return response.data;
  }
};

//get user
const getUser = async (accessToken) => {
  const response = await axios.get("http://localhost:8000/auth/user/getuser", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

//get users
const getUsers = async (accessToken) => {
  const response = await axios.get("http://localhost:8000/auth/user/getusers", {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
  return response.data;
};

// Updateuser
const updateUser = async ({
  fullname,
  email,
  phonenumber,
  gender,
  days,
  months,
  years,
  accessToken,
}) => {
  const response = await axios.post(
    "http://localhost:8000/auth/user/updateUser",
    {
      fullname,
      email,
      phonenumber,
      gender,
      days,
      months,
      years,
    },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  return response.data;
};

const updateDetailAddress = async (data) => {
  console.log(data);
  const response = await axios.post("http://localhost:8000/auth/user/updatedetailaddress",
    {
      data
    },
    {
      headers: {
        Authorization: "Bearer " + data?.accessToken,
      },
    }
  )
  return response.data;
}

const createNewPassword = async ({
  curpass,
  newpass,
  accessToken,
}) => {
  const response = await axios.post(
    "http://localhost:8000/auth/user/createnewpassword",
    {
      curpass,
      newpass,
    },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
  return response.data;
};

const userService = {
  registerUser,
  loginUser,
  forgotPassword,
  changePassword,
  getUser,
  getUsers,
  updateUser,
  updateDetailAddress,
  createNewPassword,
};

export default userService;
