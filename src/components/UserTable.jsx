import { Button, Modal, Table, message } from "antd";
import { useEffect, useState } from "react";
import { getUsers } from "../service/users";
import {
  ExclamationCircleOutlined,
  DeleteOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import "../styles/mainPage.css";
import { onBlock, onDelete, onUnBlock } from "../service/userTable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes/routesConfig";
import { setAuthUserName } from "../stateManagement/authUsername";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const { confirm } = Modal;
  const authUsername = useSelector((state) => state.authUsername.authUsername);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function fetchUsers() {
    const res = await getUsers();
    setUsers(res);
  }
  useEffect(() => {
    fetchUsers();
  }, []);

  const rowSelection = {
    onChange: (selectedRowIndes, selectedRows) => {
      setSelectedRows(selectedRows);
    },
  };

  const deleteKeys = async () => {
    const keys = selectedRows.map((key) => key.key);
    try {
      await onDelete(keys);
      message.success("Users are deleted successfully.");
      fetchUsers();
      selectedRows.forEach((row) => {
        if (row.email === authUsername) {
          localStorage.removeItem("accessToken");
          dispatch(setAuthUserName(""));
          navigate(ROUTES.LOGIN);
        }
      });
    } catch (er) {
      message.error("Something went wrong. Please, try again");
    }
  };
  const blockKeys = async () => {
    const keys = selectedRows.map((key) => key.key);
    if (keys.length == 0) {
      message.error("Please, select users to block!");
      return;
    }

    // check where there are people who were blocked
    const selectedEmails = selectedRows.map((row) => row.email);

    const blockedUsers = users.filter(
      (user) => selectedEmails.includes(user.email) && user.blocked
    );

    if (blockedUsers.length === 1) {
      message.error(`${blockedUsers[0].email} is already blocked.`);
      return;
    } else if (blockedUsers.length > 1) {
      const emails = blockedUsers.map((user) => user.email).join(", ");
      message.error(`The selected users are aleady blocked: ${emails}`);
      return;
    }
    try {
      await onBlock(keys);
      if (keys.length === 1) {
        message.success("User is blocked successfully");
        selectedRows.forEach((row) => {
          if (row.email === authUsername) {
            localStorage.removeItem("accessToken");
            dispatch(setAuthUserName(""));
            navigate(ROUTES.LOGIN);
          }
        });
      } else {
        message.success("Users are blocked successfully");
      }
    } catch (er) {
      message.error("Something went wrong while blocking users");
    }
    fetchUsers();
  };
  const unBlockKeys = async () => {
    const keys = selectedRows.map((key) => key.key);
    if (keys.length == 0) {
      message.error("Please, select blocked users to unblock!");
      return;
    }

    // check where there are people who were not blocked
    const selectedEmails = selectedRows.map((row) => row.email);

    const notBlockedUsers = users.filter(
      (user) => selectedEmails.includes(user.email) && !user.blocked
    );

    if (notBlockedUsers.length === 1) {
      message.error(
        `${notBlockedUsers[0].email} is not blocked previously. No need to unblock`
      );
      return;
    } else if (notBlockedUsers.length > 1) {
      const emails = notBlockedUsers.map((user) => user.email).join(", ");
      message.error(`The selected users are not blocked: ${emails}`);
      return;
    }
    try {
      await onUnBlock(keys);
      if (keys.length === 1) {
        message.success(`User is unblocked successfully`);
        fetchUsers();
      } else {
        message.success("Users are unblocked successfully");
        fetchUsers();
      }
    } catch (er) {
      message.error("Something went wrong while unblocking users");
    }
  };

  const handleBlock = () => {
    confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Do you want to block this user?",
      onOk() {
        blockKeys();
      },
    });
  };

  const handleUnblock = () => {
    confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Do you want to unblock this user?",
      onOk() {
        unBlockKeys();
      },
    });
  };

  const handleDelete = () => {
    confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Do you want to delete this user?",
      onOk: () => {
        deleteKeys();
        fetchUsers();
      },
    });
  };

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const dataSource = users.map((user) => ({
    key: user.id,
    name: user.name,
    email: user.email,
    status: user.blocked ? "Blocked" : "Not blocked",
    loginTime: new Date(user.loginTime).toLocaleDateString("en-US", options),
    createdAt: new Date(user.createdAt).toLocaleDateString("en-US", options),
  }));
  const columns = [
    {
      title: "Id",
      dataIndex: "key",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Login Time",
      dataIndex: "loginTime",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
    },
  ];
  return (
    <>
      <div className="table-operations">
        <Button onClick={handleBlock} type="primary" danger>
          Block
        </Button>
        <Button onClick={handleUnblock} icon={<UnlockOutlined />}>
          Unblock
        </Button>
        <Button onClick={handleDelete} icon={<DeleteOutlined />} danger>
          Delete
        </Button>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
      />
    </>
  );
}
