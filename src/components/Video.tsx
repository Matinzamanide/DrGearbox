const AnimateVideo = () => {
  return (
    <div className="w-[99.99%] lg:h-screen mt-1">
      <video
        src="/Getriebe.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-[85%] object-cover"
      />
    </div>
  );
};

export default AnimateVideo;