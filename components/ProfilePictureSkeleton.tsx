const ProfilePictureSkeleton = ({ size = 40 }) => {
  return (
    <div 
      className="rounded-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite]"
      style={{ width: size, height: size }}
    />
  );
};

export default ProfilePictureSkeleton;