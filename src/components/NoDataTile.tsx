import React from 'react';
import { CloudOff } from 'lucide-react';

interface NoDataTileProps {
  message: string;
  textColor: string;
  isLight: boolean;
}

const NoDataTile: React.FC<NoDataTileProps> = ({ message, textColor, isLight }) => {
  return (
    <div className={`flex flex-col items-center justify-center h-full ${textColor}`}>
      <CloudOff color={isLight ? "black" : "rgb(209 213 219)"} size={48} className="mb-4 opacity-50" />
      <p className="text-lg font-semibold text-center">{message}</p>
    </div>
  );
};

export default NoDataTile;
