import "./style.scss";
import InfoBlock from "../../components/infoBlock";
import PostsBlock from "../../components/postsBlock";

export default function MainContent() {
  return (
    <div className="main-content">
      <InfoBlock />
      <PostsBlock />
    </div>
  );
}
