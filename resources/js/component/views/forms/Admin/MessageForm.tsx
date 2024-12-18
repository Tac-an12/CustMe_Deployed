import React, { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Container,
  Card,
  CircularProgress,
  Box,
} from "@mui/material";
import { Send, AttachFile } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useChat } from "../../../context/ChatContext";
import { useAuth } from "../../../context/AuthContext";
import Header from "../components/header";

const ChatForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { messages, sendMessage, userChatList, fetchMessages, fetchUserChatList } = useChat();
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [selectedChatUser, setSelectedChatUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const userId = location.state?.userId;

  useEffect(() => {
    fetchMessages();
    fetchUserChatList();
  }, [fetchMessages, fetchUserChatList]);

  useEffect(() => {
    if (userId) {
      const foundUser = userChatList.find((chat) => chat.id === Number(userId));
      setSelectedChatUser(foundUser || null);
    } else if (userChatList.length > 0) {
      setSelectedChatUser(userChatList[0]);
    } else {
      setSelectedChatUser(null);
    }
  }, [userId, userChatList]);

  useEffect(() => {
    if (file) {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setFilePreview(fileReader.result as string);
      };
      if (file.type.startsWith("image/")) {
        fileReader.readAsDataURL(file);
      } else {
        setFilePreview(null); // No preview for non-image files
      }
    } else {
      setFilePreview(null);
    }
  }, [file]);

  const handleSendMessage = async () => {
    const receiverId = selectedChatUser ? selectedChatUser.id : Number(userId);
    if ((currentMessage.trim() || file) && receiverId) {
      setLoading(true);
      const success = await sendMessage(currentMessage, receiverId, file || undefined);
      if (success) {
        setCurrentMessage("");
        setFile(null);
        setFilePreview(null);
      }
      setLoading(false);
    }
  };

  const filteredMessages = messages.filter(
    (chat) =>
      (chat.sender_id === selectedChatUser?.id && chat.receiver_id === user?.id) ||
      (chat.receiver_id === selectedChatUser?.id && chat.sender_id === user?.id)
  );

  return (
    <main className="flex flex-col h-full w-full">
      <Header />
      <Container maxWidth={false} className="p-0 h-full mt-16">
        <Card className="shadow-sm m-0 h-full w-full">
          <div className="grid grid-cols-12 gap-0 h-full">
            {/* User List */}
            <div className="col-span-12 lg:col-span-5 xl:col-span-3 border-r h-full">
              <List>
                {userChatList.length > 0 ? (
                  userChatList.map((chat) => (
                    <ListItem
                      key={chat.id}
                      component="div"
                      className={`border-b hover:bg-gray-100 ${selectedChatUser?.id === chat.id ? 'bg-gray-200' : ''}`}
                      onClick={() => {
                        setSelectedChatUser(chat);
                        navigate("/chats", { state: { userId: chat.id } });
                      }}
                    >
                      <ListItemAvatar>
                        <Badge color="success" variant="dot" invisible={!chat.online}>
                          <Avatar
                            src={chat.personal_information?.profilepicture ? `https://custme.site/storage/app/public/${chat.personal_information.profilepicture}` : "https://via.placeholder.com/40"}
                            alt={chat.username || "User"}
                            className="rounded-full"
                          />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText primary={chat.username || "User"} />
                    </ListItem>
                  ))
                ) : (
                  <p className="p-4">No users found.</p>
                )}
              </List>
            </div>

            {/* Chat Area */}
            <div className="col-span-12 lg:col-span-7 xl:col-span-9 h-full">
              {selectedChatUser ? (
                <div className="py-2 px-4 border-b hidden lg:block">
                  <div className="flex justify-between">
                    <div className="flex space-x-4">
                      <Avatar
                        src={selectedChatUser?.personal_information?.profilepicture ? `https://custme.site/storage/app/public/${selectedChatUser.personal_information.profilepicture}` : "https://via.placeholder.com/40"}
                        alt={selectedChatUser.username || "User"}
                        className="w-16 h-16 rounded-full"
                      />
                      <div className="leading-tight">
                        <div className="text-md">
                          {selectedChatUser.username || "Unknown"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="p-4">Select a user to start chatting.</p>
              )}

              {/* Chat Messages */}
              <div className="chat-messages p-4 flex-grow overflow-y-auto" style={{ height: "400px", overflowY: "auto" }}>
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((chat) => (
                    <div key={chat.id} className={`flex ${chat.sender_id === user?.id ? "justify-end" : "justify-start"} mb-2`}>
                      <div className={`p-2 rounded-lg max-w-xs ${chat.sender_id === user?.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                        {chat.content && <div>{chat.content}</div>}
                        {chat.file_path && (
                          chat.file_path.endsWith(".png") || chat.file_path.endsWith(".jpg") || chat.file_path.endsWith(".jpeg") ? (
                            <img src={`https://custme.site/storage/app/public/${chat.file_path}`} alt="uploaded" style={{ width: '100%', borderRadius: '8px' }} />
                          ) : (
                            <a href={`https://custme.site/storage/app/public/${chat.file_path}`} download>
                              {chat.file_path.split('/').pop()} {/* Display file name as clickable link */}
                            </a>
                          )
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="p-4">No messages yet.</p>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t flex items-center">
                <TextField
                  variant="outlined"
                  placeholder="Type a message..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className="flex-grow"
                  InputProps={{
                    endAdornment: (
                      <IconButton component="label" color="primary">
                        <AttachFile />
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                          onChange={(e) => {
                            const files = e.target.files;
                            setFile(files && files.length > 0 ? files[0] : null);
                          }}
                          hidden
                        />
                      </IconButton>
                    ),
                  }}
                />
                {file && (
                  <Box className="ml-2 flex items-center">
                    {file.type.startsWith("image/") ? (
                      <img src={filePreview || ''} alt="preview" style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
                    ) : (
                      <span>{file.name}</span> // Display file name for non-image files
                    )}
                  </Box>
                )}
                <IconButton onClick={handleSendMessage} disabled={!currentMessage.trim() && !file || loading}>
                  {loading ? <CircularProgress size={24} /> : <Send />}
                </IconButton>
              </div>
            </div>
          </div>
        </Card>
      </Container>
    </main>
  );
};

export default ChatForm;