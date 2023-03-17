import React from 'react';
import {SidebarContainer, ItemRight, Avatar, MessageText, UserName, Time, Item, UnseenCount, Msg, ChatList} from "./styles";
import {Row} from "../../utils/sharedStyles";
import Icon from "../Icon";
import {getAvatarPath, sortConversations} from "../../utils/helpers";
import moment from "../../utils/moment";
import {CreateChat} from "../index";
import Api from '../../config/axios';
import './styles.css';

function Sidebar({user, conversations, ...props}) {
  const [createVisible, setCreateVisible] = React.useState(false);
  const [convoSelected, setConvoSelected] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('invitation');

  const getListData = React.useCallback(() => {
    const blocked = user?.blocked?.map(b => b._id);
    const blockedFrom = user?.blockedFrom?.map(b => b._id);
    const filter = c => {if (c.isGroup) return true; else return !c.users.find(u => blocked?.includes(u._id)) && !c.users.find(u => blockedFrom?.includes(u._id))};
    return conversations.filter(filter);
  }, [user, conversations]);

  const handleAcceptRequest = async (reqId) => {
    const res = await Api.post(`/friend-request/accept/${reqId}`);
    console.log(res);
  }

  const handleDeclineRequest = async (reqId) => {
    const res = await Api.post(`/friend-request/decline/${reqId}`);
    console.log(res);
  }

  const handleBlock = async (fReq) => {
    const res = await Api.put(`/user/block/${fReq.sender}`);
    console.log(res);
  }


  const msgText = React.useCallback((icon, text, unseenMessage) => <Msg><Icon name={icon} size={16} /><MessageText unseen={unseenMessage} noFont style={{marginLeft: 4}}>{text}</MessageText></Msg>, []);
  const renderItem = React.useCallback(item => {
    const recipient = item.users.find(x => x._id !== user._id);
    let text;
    const msg = item.message;
    const sender = msg?.user?._id === user._id;
    const unseenMessage = msg && !sender && !msg?.seenBy?.includes(user._id);
    const unseenMessageLength = item.unseenMessageLength;
    text = !msg ? <MessageText>Draft...</MessageText>
      : msg.image ? msgText('image', 'Photo', unseenMessage) :
        msg.audio ? msgText('headphones', 'Sound', unseenMessage):
        msg.location ? msgText('pin', 'Location', unseenMessage) :
        msg.video ? msgText('video', 'Video', unseenMessage) :
          <MessageText unseen={unseenMessage}>{(msg.text?.find(i => i.language === user.language))?.text}</MessageText>;
    return (
      <Item onClick={() => {
          props.setChatId(item._id);
          setConvoSelected(item._id);
          props.setSidebarStatus('close');
          }}
          className={convoSelected === item._id ? "selected" : ""}
          unseen={unseenMessage}
          key={item._id}
      >
        <Row>
          <Avatar src={getAvatarPath(!item.isGroup ? recipient?.avatar : item.image, item.isGroup)} />
          <div>
            <UserName unseen={unseenMessage}>{!item.isGroup ? recipient?.name : item.name}</UserName>
            <div>{text}</div>
          </div>
        </Row>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Time>{moment(msg?.createdAt || item.createdAt).fromNow()}</Time>
          {props.width > 375 ? <ItemRight>
            {unseenMessage ? <UnseenCount>{unseenMessageLength > 9 ? '9+' : unseenMessageLength}</UnseenCount> : <div style={{height: 0}} />}
            <div style={{opacity: (sender && !unseenMessage) ? 1 : 0}}><Icon name={"done-all-outline"} color="gray" size={15} /></div>
          </ItemRight>: <></>}
        </div>
      </Item>
    )
  }, [user._id, msgText, props]);

  return (
    <SidebarContainer>
      <Row align="center" justify="space-between" className="head">
        <h3>Messages</h3>
        <div onClick={() => setCreateVisible(true)}>
          <Icon name="plus-circle-outline" />
        </div>
      </Row>
      <ChatList>
        <div className='tab-container'>
          <div className={activeTab === 'invitation' ? 'selected' : ''} onClick={() => setActiveTab('invitation')}>Invitation</div>
          <div className="vertical-line"></div>
          <div className={activeTab === 'conversation' ? 'selected' : ''} onClick={() => setActiveTab('conversation')}>Conversation</div>
        </div>
        {activeTab === 'invitation' && (
        <div>
          <div className="invitation-card">
            <h5>Test 1 Has Made A Request</h5>
            <div className="invitation-options">
              <button className="accept-btn">Accept</button>
              <button className="decline-btn">Decline</button>
              <button className="block-btn">Block User</button>
            </div>
          </div>
          <div className="invitation-card">
            <h5>Test 2 Has Made A Request</h5>
            <div className="invitation-options">
              <button className="accept-btn">Accept</button>
              <button className="decline-btn">Decline</button>
              <button className="block-btn">Block User</button>
            </div>
          </div>
          <div className="invitation-card">
            <h5>Test 3 Has Made A Request</h5>
            <div className="invitation-options">
              <button className="accept-btn">Accept</button>
              <button className="decline-btn">Decline</button>
              <button className="block-btn">Block User</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'conversation' && (
        <div>
          {getListData().slice().sort(sortConversations).map(renderItem)}
        </div>
      )}
      </ChatList>
      {createVisible && <CreateChat close={() => setCreateVisible(false)} user={user} setChatId={props.setChatId} createChat={props.createChat} />}
    </SidebarContainer>
  )
}

export default Sidebar;
