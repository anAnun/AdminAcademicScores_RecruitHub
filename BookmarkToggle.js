import React from "react";
import ReactDom from "react-dom";
import { bookmark_get } from "./server";
import { bookmark_post } from "./server";

// to use you'll need to pass the userId and the targetId which is the id of the post
// you are adding the bookmark button to

//<BookmarkToggle userId=''/>   if the bookmark is for a user
// OR <BookmarkToggle postId=''/>    if the bookmark is for a post
// put the line above where ever you want the bookmark button to be with ids included

class BookmarkToggle extends React.Component {
  state = {
    targetId: this.props.targetId,
    targetType: this.props.targetType,
    tags: "",
    tagsBookmark: [],
    public: [],
    tag: [],
    tagArrayForBookmarkPost: []
  };

  componentDidMount = () => {
    if (this.props.userId) {
      this.targetType = 1;
      this.targetId = this.props.userId;
    } else if (this.props.postId) {
      this.targetType = 2;
      this.targetId = this.props.postId;
    } else {
      throw Error("must specify either userId or postId as prop");
    }
    this.getByTargetIdAndTargetType();
  };

  getByTargetIdAndTargetType = () => {
    let tagJson;
    let publicJson;
    const myPromise = bookmark_get(this.targetId, this.targetType);
    myPromise.then(tagArray => {
      const tags = [];
      for (let i = 0; i < tagArray.data.items.length; i++) {
        const tag = {
          tag: tagArray.data.items[i].tag,
          public: tagArray.data.items[i].public
        };
        tags.push(tag);
      }

      this.setState({
        tagArrayForBookmarkPost: tags
      });
    });
  };
  postNotPut = () => {
    const myPromise = bookmark_post({
      targetId: this.targetId,
      targetType: this.targetType,
      tags: this.state.tagArrayForBookmarkPost
    });
  };

  isBookmarked = () => {
    return this.state.tagArrayForBookmarkPost.some(t => t.tag === "bookmark");
  };

  setBookmark = isBookmarked => {
    if (isBookmarked) {
      const tags = [
        ...this.state.tagArrayForBookmarkPost,
        { tag: "bookmark", public: false }
      ];
      this.setState({ tagArrayForBookmarkPost: tags }, this.postNotPut);
    } else {
      const tags = this.state.tagArrayForBookmarkPost.filter(
        t => t.tag !== "bookmark"
      );

      this.setState({ tagArrayForBookmarkPost: tags }, this.postNotPut);
    }
  };

  render() {
    return (
      <div className="form-group">
        <div className="container-fluid">
          {!this.isBookmarked() ? (
            <button
              style={{
                borderRadius: "8px",
                fontSize: "24px",
                backgroundColor: "white"
              }}
              className="form-footer btn-lg btn btn-default"
              onClick={() => this.setBookmark(true)}
            >
              ☆
            </button>
          ) : (
            <button
              style={{
                borderRadius: "8px",
                fontSize: "24px"
              }}
              className="form-footer btn-lg btn btn-warning active"
              onClick={() => this.setBookmark(false)}
            >
              ★
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default BookmarkToggle;
