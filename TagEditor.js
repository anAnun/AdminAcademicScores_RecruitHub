import React from "react";
import { Chips } from "./Chips";
import axios from "axios";
import { showModal } from "./SmallModal";

//this depends on the internals of the prime react chips, if it breaks, be suspicious of
//where i do the publicChips.setState

const convertTagArrayToState = tagArray => {
  return {
    public: tagArray.filter(tag => tag.public).map(tag => tag.tag),
    private: tagArray.filter(tag => !tag.public).map(tag => tag.tag)
  };
};

class TagEditor extends React.Component {
  state = {
    public: [],
    private: [],
    targetId: this.props.userId,
    value: this.props.value,
    tags: [],
    targetType: this.props.targetType
  };

  componentDidMount = () => {
    this.setState(convertTagArrayToState(this.props.value));
    // if you need to do the ajax call (because no props.value),
    // do the call, and then in the ".then" pass the results into convertTagArrayToState
    // take the result of that call, and you call setState
  };
  componentDidUpdate = () => {};
  publicPost = ({ value }) => {
    const publicTags = this.state.public;
    const privateTags = this.state.private;

    if (publicTags.indexOf(value) >= 0) {
      this.publicChips.setState({ values: publicTags });
      showModal({
        title: "ERROR",
        body: "tag already exists!!",
        closeButtonText: false,
        modalStyle: "danger"
      }).then(() => console.log("ok!"));
      return;
    } else if (privateTags.indexOf(value) >= 0) {
      this.publicChips.setState({ values: publicTags });
      showModal({
        title: "ERROR",
        body: "tag already exists in private!!",
        closeButtonText: false,
        modalStyle: "danger"
      }).then(() => console.log("ok!"));
      return;
    }
    const newPublic = [...publicTags, value];
    this.setState(
      {
        public: newPublic,
        singledPublic: value
      },
      this.put
    );
  };

  privatePost = ({ value }) => {
    const privateTags = this.state.private;
    const publicTags = this.state.public;

    if (privateTags.indexOf(value) >= 0) {
      this.privateChips.setState({ values: privateTags });

      showModal({
        title: "ERROR",
        body: "tag already exists!!",
        closeButtonText: false,
        modalStyle: "danger"
      }).then(() => console.log("ok!"));
      return;
    } else if (publicTags.indexOf(value) >= 0) {
      this.privateChips.setState({ values: privateTags });
      showModal({
        title: "ERROR",
        body: "tag already exists in public!!",
        closeButtonText: false,
        modalStyle: "danger"
      }).then(() => console.log("ok!"));
      return;
    }

    const oldPrivateTags = this.state.value;
    const newPrivate = [...privateTags, value];
    const newBuiltTags = [...newPrivate, oldPrivateTags];

    this.setState(
      {
        private: newPrivate,
        singledPrivate: value
      },
      this.put
    );
  };

  put = () => {
    const tags = [...this.state.value];

    const publicArray = [...this.state.public];
    const privateArray = [...this.state.private];

    if (this.state.singledPublic) {
      const incomingPublicTag = {
        tag: this.state.singledPublic,
        public: true
      };
      tags.push(incomingPublicTag);

      const myPromise = axios.put("/api/favorites", {
        targetId: this.state.targetId,
        targetType: this.state.targetType,
        tags: tags
      });
      myPromise.then(
        this.setState(
          {
            singledPublic: false
          },
          this.componentDidUpdate
        )
      );
    }

    if (this.state.singledPrivate) {
      const incomingPrivateTag = {
        tag: this.state.singledPrivate,
        public: false
      };
      tags.push(incomingPrivateTag);
      const myPromise = axios.put("/api/favorites", {
        targetId: this.state.targetId,
        targetType: this.state.targetType,
        tags: tags
      });
      myPromise.then(
        this.setState(
          {
            singledPrivate: false
          },
          this.componentDidUpdate
        )
      );
    }
  };
  // putDelete = () => {
  //   const myPromise = axios.put("/api/favorites", {
  //     targetId: this.state.targetId,
  //     targetType: this.state.targetType,
  //     tags: this.state.value
  //   });
  // };

  // delete = (values, stateKey) => {
  //   const array = this.state[stateKey];

  //   showModal({
  //     title: "Tag deleted",
  //     closeButtonText: false,
  //     modalStyle: "danger"
  //   }).then(() => {
  //     const newArray = array.filter(item => !values.includes(item));
  //     this.setState(
  //       {
  //         [stateKey]: newArray
  //       },
  //       this.putDelete
  //     );
  //   });
  // };
  // putDelete = () => {
  //   const myPromise = axios.put("/api/favorites", {
  //     targetId: this.state.targetId,
  //     targetType: this.state.targetType,
  //     tags: this.state.value
  //   });
  // };

  // delete = ({ value }) => {
  //   const array = [...this.state.value];
  //   for (let i = 0; i < array.length; i++) {
  //     if (array[i].tag === value[0]) {
  //       array.splice(i, 1);
  //       break;
  //     }
  //   }
  //   this.setState(
  //     {
  //       value: array
  //     },
  //     this.putDelete
  //   );
  // };
  putDelete = () => {
    const myPromise = axios.put("/api/favorites", {
      targetId: this.state.targetId,
      targetType: this.state.targetType,
      tags: this.state.value
    });
  };

  delete = ({ value }) => {
    const array = [...this.state.value];

    showModal({
      title: "Tag deleted",
      closeButtonText: false,
      modalStyle: "danger"
    }).then(() => {
      for (let i = 0; i < array.length; i++) {
        if (array[i].tag === value) {
          array.splice(i, 1);
          break;
        }
      }
      this.setState(
        {
          value: array
        },
        this.putDelete
      );
    });
  };

  render() {
    return (
      <div className="form-group">
        <div className="content-section implementation">
          <h3>Public</h3>
          <Chips
            onAdd={this.publicPost}
            onRemove={this.delete}
            values={this.state.public}
            ref={chips => (this.publicChips = chips)}
          />

          <h3>Private</h3>
          <Chips
            onAdd={this.privatePost}
            onRemove={this.delete}
            values={this.state.private}
            ref={chips => (this.privateChips = chips)}
            itemTemplate={this.customTemplate}
          />
        </div>
      </div>
    );
  }
}

export default TagEditor;
