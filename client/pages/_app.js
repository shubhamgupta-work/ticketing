import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  //context === {req}
  // buildClient(context) -> this is a preconfigured axios
  const client = buildClient(appContext.ctx);
  const {
    data: { currentUser },
  } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext?.Component?.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, currentUser);
  }

  return { pageProps, currentUser };
};

export default AppComponent;
