import { Button } from "./ui/button";
import { Play, Pause, Plus, Music2, SearchX } from "lucide-react";

const SearchResults = ({ results, currentTrack, isPlaying, onPlayPause, onAddToQueue }) => {
    return (
        <div className="container mx-auto px-4 py-6 pb-24">
            <div className="flex items-center gap-2 mb-6">
                <Music2 className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Search Results
                </h2>
            </div>

            {results.length === 0 ? (
                <div className="bg-card rounded-xl p-12 border shadow-xl flex flex-col items-center justify-center text-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 blur-xl opacity-50 animate-pulse" />
                        <SearchX className="w-16 h-16 relative z-10 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        No tracks found
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-sm bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Try searching for your favorite artist, song, or video to start building your playlist
                    </p>
                </div>
            ) : (
                <div className="bg-card rounded-xl p-6 border shadow-xl">
                    {results.map((video) => (
                        <div
                            key={video.id}
                            className="group relative flex gap-4 p-4 rounded-lg hover:bg-accent/40 transition-all duration-300 border-b last:border-b-0"
                        >
                            <div className="shrink-0">
                                <div className="relative w-24 h-24 overflow-hidden rounded-lg bg-gradient-to-br from-purple-600/10 to-blue-600/10">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span className="absolute bottom-1.5 right-1.5 bg-black/90 text-xs text-white px-2 py-0.5 rounded-md backdrop-blur-sm">
                                        {video.duration}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-grow flex items-center justify-between min-w-0">
                                <div className="space-y-1 min-w-0">
                                    <p className="font-semibold truncate pr-4 group-hover:bg-gradient-to-r from-purple-600 to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                                        {video.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {video.channelTitle}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full hover:bg-gradient-to-r from-purple-600 to-blue-600 hover:text-white"
                                        onClick={() => onPlayPause(video)}
                                    >
                                        {currentTrack?.id === video.id && isPlaying ? (
                                            <Pause className="h-4 w-4" />
                                        ) : (
                                            <Play className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full hover:bg-gradient-to-r from-purple-600 to-blue-600 hover:text-white"
                                        onClick={() => onAddToQueue(video)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
