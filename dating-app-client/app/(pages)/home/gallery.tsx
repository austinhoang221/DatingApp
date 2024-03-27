import { IMemberResponseModel } from "@/app/_models/_members/IMemberResponseModel";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import React, { useState } from "react";
interface IGalleryProps {
  user: IMemberResponseModel;
  isOpenProfile: boolean;
}
export default function Gallery(props: IGalleryProps) {
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const { user, isOpenProfile } = props;
  return (
    <MotionConfig transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}>
      {user?.photos.map((image, i) => (
        <motion.div
          animate={{ x: `-${photoIndex * 100}%` }}
          className="absolute inset-0 flex justify-center items-center"
        >
          <img
            key={image.id}
            src={image.url}
            alt=""
            className={
              isOpenProfile
                ? "h-full w-full object-cover"
                : "absolute inset-0 w-full h-[32rem] object-cover"
            }
          />
        </motion.div>
      ))}
      <AnimatePresence initial={false}>
        {photoIndex > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            whileHover={{ opacity: 1 }}
            className="absolute left-2 top-1/2 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white"
            onClick={() => setPhotoIndex((prevIndex) => prevIndex - 1)}
          >
            <KeyboardArrowLeftIcon className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {photoIndex + 1 < user?.photos?.length && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            whileHover={{ opacity: 1 }}
            className="absolute right-2 top-1/2 -mt-4 flex h-8 w-8 items-center justify-center rounded-full bg-white"
            onClick={() => setPhotoIndex((prevIndex) => prevIndex + 1)}
          >
            <KeyboardArrowRightIcon className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
