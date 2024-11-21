import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Box, Flex, Text } from '@radix-ui/themes';
import { TimerIcon, PauseIcon, PlayIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import TrackStatus from './TrackStatus';
import { setCurrentSong, setIsPlaying } from '../store/slicers/userSlice';

const TrackTable = ({
  tracks,
  isPlaylist = false,
}) => {
  const dispatch = useDispatch();
  const { currentSong, isPlaying } = useSelector((state) => state.user);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [currentUserIdOnHover, setCurrentUserIdOnHover] = useState(null);

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const timeAgo = (date) => {
    const now = new Date();
    const diff = now - new Date(date);

    const units = [
      { name: 'year', factor: 31536000000 },
      { name: 'day', factor: 86400000 },
      { name: 'hour', factor: 3600000 },
      { name: 'minute', factor: 60000 },
      { name: 'second', factor: 1000 },
    ];

    for (const unit of units) {
      const value = Math.floor(diff / unit.factor);
      if (value > 0) {
        return `${value} ${unit.name}${value > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  };

  const hoverClass = (item) =>
    selectedTrack !== (isPlaylist ? item.track.id : item.id)
      ? 'hover:backdrop-brightness-95'
      : '';

  const activeClass = (item) =>
    selectedTrack === (isPlaylist ? item.track.id : item.id)
      ? 'backdrop-brightness-90'
      : '';

  const handlePlay = (track) => {
    if (currentSong?.id === track.id) {
      dispatch(setIsPlaying(!isPlaying));
    } else {
      dispatch(setCurrentSong(track));
      dispatch(setIsPlaying(true));
    }
  };

  return (
    <Table.Root
      size="2"
      layout=""
      className="overflow-y-scroll"
      onClick={(e) => e.stopPropagation()}
    >
      <Table.Header className="sticky top-0 left-0 backdrop-brightness-100 backdrop-blur-3xl z-10">
        <Table.Row>
          <Table.ColumnHeaderCell>
            <Box className="text-xs">#</Box>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <Box className="text-xs">Title</Box>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <Box className="text-xs">Album</Box>
          </Table.ColumnHeaderCell>
          {isPlaylist && (
            <Table.ColumnHeaderCell>
              <Box className="text-xs">Date Added</Box>
            </Table.ColumnHeaderCell>
          )}
          <Table.ColumnHeaderCell>
            <Box className="text-xs">
              <TimerIcon />
            </Box>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {tracks?.map((item, index) => {
          const track = isPlaylist ? item.track : item;
          const trackId = isPlaylist ? item.track.id : item.id;
          
          return (
            <Table.Row
              key={trackId}
              onClick={() => setSelectedTrack(trackId)}
              onMouseEnter={() => setCurrentUserIdOnHover(trackId)}
              onMouseLeave={() => setCurrentUserIdOnHover(null)}
              className={`select-none active:backdrop-brightness-90 ${hoverClass(
                item
              )} ${activeClass(item)}`}
            >
              <Table.Cell>
                <Flex align="center" gap="3">
                  {currentUserIdOnHover === trackId ? (
                    <button
                      className="w-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(track);
                      }}
                    >
                      {currentSong?.id === trackId && isPlaying ? (
                        <PauseIcon />
                      ) : (
                        <PlayIcon />
                      )}
                    </button>
                  ) : (
                    <Text size="2" className="w-4">
                      {index + 1}
                    </Text>
                  )}
                </Flex>
              </Table.Cell>

              <Table.Cell>
                <Flex align="center" gap="3">
                  {track?.album?.images[0]?.url && (
                    <img
                      src={track.album.images[0].url}
                      className="w-10 h-10"
                      alt=""
                    />
                  )}
                  <Flex direction="column">
                    <Text>{track?.name}</Text>
                    <Text size="1" color="gray">
                      {track?.artists?.map((artist) => (
                        <Link
                          to={`/artist/${artist.id}`}
                          key={artist.id}
                          className="hover:underline"
                        >
                          {artist.name}
                        </Link>
                      )).reduce((prev, curr) => [prev, ', ', curr])}
                    </Text>
                  </Flex>
                  {currentSong?.id === trackId && (
                    <TrackStatus isPlaying={isPlaying} />
                  )}
                </Flex>
              </Table.Cell>

              <Table.Cell>
                <Text size="2" color="gray">
                  {track?.album?.name}
                </Text>
              </Table.Cell>

              {isPlaylist && (
                <Table.Cell>
                  <Text size="2" color="gray">
                    {timeAgo(item?.added_at)}
                  </Text>
                </Table.Cell>
              )}

              <Table.Cell>
                <Text size="2" color="gray">
                  {formatDuration(track?.duration_ms)}
                </Text>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
};

export default TrackTable;
