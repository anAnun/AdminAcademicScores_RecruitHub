import React from "react";
import BookmarkToggle from "./BookmarkToggle";
import UserAvatar from "./UserAvatar";
import "./Favorites.css";
import TagEditor from "./TagEditor";
import ReadOnlyFeed from "./ReadOnlyFeed";
import { favorites_get } from "./server";

class Favorites extends React.Component {
  state = {
    selected: 1,
    userPosts: [],
    tagsArray: [],
    objectArray: [],
    objectForTargetType: [],
    result: null
  };

  change = e => {
    this.setState({ selected: e.target.value });
  };

  componentDidMount = () => {
    this.getAllUsers();
  };
  getAllUsers = () => {
    const myPromise = favorites_get();
    myPromise.then(obj => {
      for (let i = 0; i < obj.data.items.length; i++) {
        if (this.state.selected) this.arrayTreeForGet(obj.data.items);
      }
    });
  };

  arrayTreeForGet = objectArray => {
    const result = {};

    for (let i = 0; i < objectArray.length; i++) {
      let objectForTargetType = result[objectArray[i].targetType];
      if (!objectForTargetType) {
        objectForTargetType = {};
        result[objectArray[i].targetType] = objectForTargetType;
      }

      let arrayForTargetId = objectForTargetType[objectArray[i].targetId];
      if (!arrayForTargetId) {
        arrayForTargetId = [];
        objectForTargetType[objectArray[i].targetId] = arrayForTargetId;
      }
      arrayForTargetId.push({
        tag: objectArray[i].tag,
        public: objectArray[i].public
      });
    }

    this.setState({ result });
  };

  render() {
    if (!this.state.result) return null;

    return (
      <div className="row Favorites">
        <div className="col-md-6 form-group">
          <select value={this.state.selected} onChange={this.change}>
            <option value="1">Users</option>
            <option value="2">Posts</option>
          </select>

          {this.state.selected == 1 ? (
            <div className="row">
              {Object.keys(this.state.result[1]).map(userId => {
                const tagsForUser = this.state.result[1][userId];
                return (
                  <div key={userId} className="form-footer">
                    <UserAvatar
                      id={userId}
                      imageClass="img-circle"
                      className="UserAvatar"
                    />

                    <ul>
                      <li>User ID: {userId}</li>

                      <TagEditor
                        value={tagsForUser}
                        targetType="1"
                        userId={userId}
                        tags={tagsForUser}
                      />
                      <br />
                    </ul>

                    <div className="form-group">
                      <div className="container-fluid" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : this.state.selected == 2 ? (
            <div className="row">
              {Object.keys(this.state.result[2]).map(userId => {
                const tagsForUser = this.state.result[2][userId];
                return (
                  <div key={userId} className="form-footer">
                    <ul>
                      <li>User ID: {userId}</li>
                      <ReadOnlyFeed postIds={[userId]} />
                      <TagEditor
                        value={tagsForUser}
                        targetType="2"
                        userId={userId}
                        tags={tagsForUser}
                      />

                      <br />
                    </ul>

                    <div className="form-group">
                      <div className="container-fluid" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Favorites;
