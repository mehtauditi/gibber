import React from 'react';
import {ChatContainer, ChatContent, Header, HeaderAvatar, LoadBtn, MessageText, StatusTxt} from "./styles";
import {getAvatarPath, mapMessageData} from "../../utils/helpers";
import { Bubble, Avatar, GiftedChat  } from "react-native-gifted-chat";
import LocationMessage from "./components/LocationMessage";
import {getBubbleProps} from "./components/bubbleProps";
import {theme} from "../../config/theme";
import ChatInput from "./components/ChatInput";
import Api from '../../config/axios';
import {CenteredContent, Row} from "../../utils/sharedStyles";
import {disconnectSocket, initiateSocket, sendMessage, subscribeToChat, subscribeToUserTypingStatus, userTyping} from "./socket";
import VideoMessage from "./components/VideoMessage";
import AudioMessage from "./components/AudioMessage";
import ImageMessage from "./components/ImageMessage";
import {Spinner, Switch} from '../index'
import Icon from '../Icon';
import useDimensions from "../../utils/useDimensions";
import {checkRecipientOnline, removeListeners, subscribeToOffline, subscribeToOnline, subscribeToRecipientOnlineStatus} from "../../pages/ChatRoom/socket";
import styled from 'styled-components/native';

let timeout;


function Chat({data, user, mode, sideBarToggle,sidebarStatus, ...props}) {
  const { width } = useDimensions();
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [isGroup, setIsGroup] = React.useState(false);
  const [groupName, setGroupName] = React.useState('');
  const [groupImage, setGroupImage] = React.useState('');
  const [recipient, setRecipient] = React.useState();
  const [recipients, setRecipients] = React.useState([]);
  const [isReady, setIsReady] = React.useState(false);
  const [loadingMoreMsg, setLoadingMoreMsg] = React.useState(false);
  const [noMoreMsg, setNoMoreMsg] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [isOnline, setIsOnline] = React.useState(false);
  const [recipientTyping, setRecipientTyping] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const [selectedBubble, setSelectedBubble] = React.useState(null);
  //Testing something out for load more button here
  const [totalPages, setTotalPages] = React.useState(1);

  React.useEffect(() => {
    setIsReady(false);
    setMessages([]);
    setMessage('');
    setIsGroup(false);
    setGroupName('');
    setGroupImage('');
    setRecipient();
    setRecipients([]);
    setLoadingMoreMsg(false);
    setNoMoreMsg(false);
    setPage(0);
    setData();
  }, [data]);
  const setData = React.useCallback(async () => {
    if (data._id) {
      removeListeners(['userOnline', 'userOffline']);
      disconnectSocket();
      initiateSocket(data._id);
      subscribeToChat(data => {
        if (data.message) {

          setMessages(oldChats =>[data.message, ...oldChats]);
          setSeenMessages([data.message._id]);
        }
      });
      if (!data.isGroup) {
        const recipientUser = data.users.find(x => x._id !== user._id);
        setRecipient(recipientUser);
        subscribeToOnline(recipientUser._id, () => setIsOnline(true));
        subscribeToOffline(recipientUser._id, () => setIsOnline(false));
        subscribeToUserTypingStatus(status => setRecipientTyping(status));
        subscribeToRecipientOnlineStatus(status => setIsOnline(status));
        checkRecipientOnline(recipientUser._id);
      }
      else {
        setRecipients(data.users.filter(x => x._id !== user._id));
        setGroupName(data.name);
        setGroupImage(data.image);
        setIsGroup(true);
      }
      setMessages(data.messages || []);
      const unseenMessages = data.messages.filter(m => m.user !== user._id && !m.seenBy?.includes(user._id)).map(m => m._id);
      setSeenMessages(unseenMessages);
      setIsReady(true);
    }
  }, [data]);

  const setSeenMessages = React.useCallback(async (messageIds) => {
    const reqData = {messageIds, conversationId: data._id, userId: user._id};
    await Api.put('/chat/conversation/set-seen-messages', {messageIds});
    props.setSeenMessages(reqData);
  }, [data, user]);

  const messagesData = React.useMemo(() => mapMessageData(messages), [messages]);

  const onSend = React.useCallback(async (id, message) => {
    const res = await Api.post('/chat/conversation/reply/' + id, {messageData: {...message}, originalLang: user.language});
    props.updateLastMessage(id, res.data.message);
    setMessages(messages => messages.map((msg, i) => i === 0 ? res.data.message : msg));
    sendMessage({...res.data.message, recipientIds: isGroup ? recipients.map(r => r._id) : [recipient._id]});
  }, [isGroup, recipients, recipient, data]);

  const onChangeTimeoutFunc = React.useCallback(() => {
    setIsTyping(false);
    userTyping(false);
  }, []);
  React.useEffect(() => {
    if (message && isOnline) {
      if(!isTyping) {
        setIsTyping(true);
        userTyping(true);
        timeout = setTimeout(onChangeTimeoutFunc, 1500);
      } else {
        clearTimeout(timeout);
        timeout = setTimeout(onChangeTimeoutFunc, 1500);
      }
    }
  }, [message]);

  const appendMessage = React.useCallback((message) => {
    console.log('appendMessage');
    setMessages(previousMessages => [{
      _id: Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10),
      ...message,
      createdAt: new Date(),
      user: {_id: user._id, name: user.name, avatar: user.avatar},
    }, ...previousMessages]);

  }, [user, recipients, isGroup, recipient]);

  const deleteMessage = React.useCallback(async (message) => {
    if (message.user._id === user._id) {
      await Api.delete('/chat/conversation/message/' + message._id);
      setMessages(messages => messages.filter(msg => msg._id !== message._id));
      const isLastMsg = messages.findIndex(m => m._id === message._id) === 0;
      if (isLastMsg) props.updateLastMessage(data._id, messages[1]);
    }
  }, [user._id, messages, data._id, props]);

  const onBubbleLongPress = React.useCallback((context, message) => {
    const options = message.user._id === user._id
    ? ['Show Original Text', 'Delete Message', 'Cancel']
    : ['Show Original Text', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    if (options.length === 3) {
      context.actionSheet().showActionSheetWithOptions({options, cancelButtonIndex}, async (buttonIndex) => {
        if (buttonIndex === 0) setSelectedBubble(message._id);
        if (buttonIndex === 1) deleteMessage(message);
      })
    } else if (options.length === 2) {
      context.actionSheet().showActionSheetWithOptions({options, cancelButtonIndex}, async (buttonIndex) => {
        if (buttonIndex === 0) setSelectedBubble(message._id);
      })
    }
  }, [messages, data._id]);



  // const loadMore = React.useCallback(async () => {
  //   const newPage = page + 1;
  //   setLoadingMoreMsg(true);
  //   await getConvoMessages(newPage);
  //   setLoadingMoreMsg(false);
  //   setPage(newPage);
  //   // const res = await Api.get(`/chat/conversation/${data._id}/messages?page=${newPage}`);
  //   //This fixed the buggy behavior where the chat container would keep trying to render messages and caused the user not to be able to scroll up
  //   // setMessages(state => [...state, ...res.data.messages]);
  //   // if (res.data.messages.length === 0) setNoMoreMsg(true);
  //   // setLoadingMoreMsg(false);
  //   // setPage(newPage);
  // }, [page]);

  // // const renderLoadMoreBtn = React.useMemo(() => (!noMoreMsg) ?
  // //   <LoadBtn onClick={loadMore} disabled={loadingMoreMsg}>{loadingMoreMsg ? <Spinner size={25} color="#fff"/> : 'Load more'}</LoadBtn>
  // //   : null, [messages, loadingMoreMsg, noMoreMsg, page]);


  const loadMore = React.useCallback(async () => {
    console.log('Loading more');
    const newPage = page + 1;
    setLoadingMoreMsg(true);
    const resPageCount = await Api.get(`/chat/conversation/${data._id}/messages/totalPages`);
    const pageCount = resPageCount.data.pageCount - 1;

    const res = await Api.get(`/chat/conversation/${data._id}/messages?page=${newPage}`);
    setMessages(state => [...state, ...res.data.messages]);
    setLoadingMoreMsg(false);
    setPage(newPage);
    console.log('Total pages to be loaded: ' + pageCount);
    console.log('newPage value ' + newPage)
    console.log(`Number of messages rendered: ${messages.length}`);
    if(newPage === pageCount) setNoMoreMsg(true);
  }, [page]);

  // const renderLoadMoreBtn = React.useMemo(() => (messages.length > 0 && !noMoreMsg) ?
  //   <LoadBtn onClick={loadMore} disabled={loadingMoreMsg}>{loadingMoreMsg ? <Spinner size={25} color="#fff"/> : 'Load more'}</LoadBtn>
  //   : null, [messages, loadingMoreMsg, noMoreMsg, page]);

    const renderLoadMoreBtn = React.useMemo(() => {
    if(messages.length > 19 && !noMoreMsg) {
      return (
        <LoadBtn onClick={loadMore} disabled={loadingMoreMsg}>
          {loadingMoreMsg ? <Spinner size={25} color="#fff"/> : 'Load More'}
        </LoadBtn>
      );
    } else {
      return null;
    }
  }, [loadingMoreMsg, messages, loadMore, noMoreMsg]);

  if (!isReady) return <CenteredContent className="loading"><Spinner/></CenteredContent>;
  return (
    <ChatContainer onFocus={() => {
        if(sidebarStatus === 'open') sideBarToggle('close');
      }}>
      <Header>
      {width < 700 ? <div onClick={sideBarToggle}><Icon name="menu-outline" color="#848484" /></div>: <></>}
        <Row align="center" onClick={() => !isGroup && props.setProfile(recipient._id)}>
          <HeaderAvatar src={getAvatarPath(isGroup ? groupImage : recipient.avatar, isGroup)} />
          <div>
            {isGroup ? groupName : recipient.name}
            {!isGroup && recipientTyping ? <StatusTxt>Typing...</StatusTxt> : isOnline ? <StatusTxt>Online</StatusTxt> : null}
          </div>
        </Row>
        <Switch onChange={() => props.setMode(mode === 'dark' ? 'light' : 'dark')} checked={mode === 'dark'} checkedIcon={false} height={25} uncheckedIcon={false} />
      </Header>
      <ChatContent>
        <GiftedChat
          messages={messagesData}
          user={{_id: user._id}}
          minInputToolbarHeight={60}
          renderBubble={props => {
            if (props.currentMessage.location) return
            <LocationMessage location={props.currentMessage.location} messagePosition={props.position}/>;
            if (props.currentMessage.audio) return <AudioMessage src={props.currentMessage.audio}/>;

            else {
              const allProps = {...props, ...getBubbleProps(theme[mode]),onLongPress: onBubbleLongPress};
              return (
                <>
                  <Bubble {...allProps} />
                </>
              )
            }
          }}
          renderMessageText={props => {
          if (selectedBubble === props.currentMessage._id) {
            return <MessageText right={props.position === 'right'}>{typeof(props.currentMessage?.text) == 'string' ? props.currentMessage?.text : (props.currentMessage?.text.find(i => i.language === user.language))?.text} <br/>
            <StyledText>
              {props.currentMessage.originalText}
            </StyledText></MessageText>
          } else {
            return <MessageText right={props.position === 'right'}>{typeof(props.currentMessage?.text) == 'string' ? props.currentMessage?.text : (props.currentMessage?.text.find(i => i.language === user.language))?.text}</MessageText>
          }
        }}
          renderAvatar={props => <Avatar {...props} containerStyle={{left: {top: -10, marginRight: 0}}} />}
          renderInputToolbar={() => <ChatInput sidebarStatus={sidebarStatus} value={message} onChange={setMessage} onSend={onSend} appendMessage={appendMessage} chatId={data._id} mode={mode} user={user} />}
          renderMessageVideo={props => <VideoMessage src={props.currentMessage.video}/>}
          renderMessageImage={props => <ImageMessage src={props.currentMessage.image} />}
          listViewProps={{ListFooterComponent: renderLoadMoreBtn}}
          extraData={[mode]}
          shouldUpdateMessage={(props, nextProps) => props.extraData !== nextProps.extraData}
        />
      </ChatContent>
    </ChatContainer>
  )
}

const StyledText = styled.Text`
  font-style: italic;
  color: #444;
`;

export default Chat;
