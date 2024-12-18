import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import {
    Play,
    Pause,
    Music2,
    Users,
    Clock,
    Heart,
    Search,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const Dashboard = ({
    user,
    currentUser, // Add this prop
    currentTrack,
    isPlaying,
    onPlayPause,
}) => {
    // Add responsive breakpoints
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
    const isDesktop = useMediaQuery({ minWidth: 1024 });
    const [users, setUsers] = useState([]);
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const navigate = useNavigate();

    const handleApprovalToggle = async (userId, currentStatus) => {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, {
                isApproved: !currentStatus
            });

            setUsers(users.map(user =>
                user.uid === userId
                    ? { ...user, isApproved: !currentStatus }
                    : user
            ));
        } catch (error) {
            console.error('Error updating user approval status:', error);
        }
    };

    useEffect(() => {
        console.log('Current user role:', currentUser?.role);
    }, [currentUser]);

    const fetchYoutubeVideos = async () => {
        try {
            const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    maxResults: 10,
                    key: YOUTUBE_API_KEY,
                    type: 'video',
                    q: 'music trending'
                }
            });

            const videos = response.data.items.map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.default.url,
                channelTitle: item.snippet.channelTitle,
                duration: '3:45'
            }));

            setRecentlyPlayed(videos);
        } catch (error) {
            console.error('Error fetching YouTube videos:', error);
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = await getDocs(collection(db, "users"));
            setUsers(usersCollection.docs.map(doc => ({
                ...doc.data(),
                uid: doc.id
            })));
        };

        fetchUsers();
        fetchYoutubeVideos();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
            {/* Hero Welcome Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 mb-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Content */}
                        <div className="relative z-10 py-8 flex flex-col justify-center">
                            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                                Welcome back, {currentUser?.displayName || 'Music Lover'}! 👋
                            </h1>
                            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                                Your personal music dashboard is ready. Discover trending tracks, manage your library, and connect with other music enthusiasts.
                            </p>
                            <div className="mt-8 flex gap-4">
                                <Button
                                    className="bg-primary hover:bg-primary/90 relative overflow-hidden group px-6 py-3"
                                    onClick={() => navigate('/dashboard/library')}
                                >
                                    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform translate-x-full bg-gradient-to-r from-primary-light to-primary group-hover:-translate-x-0" />
                                    <span className="relative flex items-center gap-2">
                                        <Music2 className="w-5 h-5" />
                                        <span className="font-semibold">My Library</span>
                                    </span>
                                </Button>

                                <Button
                                    variant="outline"
                                    className="relative overflow-hidden group border-2 border-primary/20 hover:border-primary/50 px-6 py-3"
                                    onClick={() => navigate('/dashboard/search')}
                                >
                                    <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-full bg-gradient-to-r from-background to-primary/10 group-hover:translate-x-0" />
                                    <span className="relative flex items-center gap-2">
                                        <Search className="w-5 h-5" />
                                        <span className="font-semibold">Discover Music</span>
                                    </span>
                                </Button>
                            </div>
                        </div>

                        {/* Right Content - Floating Phone Mockup */}
                        <div className="relative hidden md:flex items-center justify-center">
                            {/* Floating Headphones */}
                            <div className="absolute -top-20 right-0 z-20 animate-float-delayed">
                                <img
                                    src="/resources/headphones.png"
                                    alt="Headphones"
                                    className="w-48 h-48 object-contain drop-shadow-2xl transform -rotate-12 hover:rotate-0 transition-all duration-700"
                                />
                            </div>

                            <div className="relative w-[700px] h-[600px] animate-float transform rotate-12 hover:rotate-6 transition-transform duration-700">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl transform -rotate-6 scale-95 blur-xl" />
                                <img
                                    src="/resources/mockup.png"
                                    alt="Phone Mockup"
                                    className="w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                                />
                                {/* Logo positioned inside the mockup with glow effect */}
                                <img
                                    src="/images/minstrel-logo.png"
                                    alt="Minstrel Logo"
                                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 object-contain animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                                />
                                {/* Decorative elements */}
                                <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
            </div>

            <div className={`grid gap-4 p-6 px-32 pb-32 ${isMobile ? 'grid-cols-1' :
                isTablet ? 'grid-cols-2' :
                    'lg:grid-cols-6'
                }`}>
                {/* Stats Cards Row */}
                <div className={`${isMobile ? 'col-span-1' :
                    isTablet ? 'col-span-2' :
                        'col-span-6'
                    } grid gap-4 ${isMobile ? 'grid-cols-1' :
                        isTablet ? 'grid-cols-2' :
                            'lg:grid-cols-4'
                    }`}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>
                                Total Songs
                            </CardTitle>
                            <Music2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
                                {recentlyPlayed.length || 0}
                            </div>
                            <p className="text-xs text-muted-foreground">+20 from last week</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>
                                Followers
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
                                {users.length}
                            </div>
                            <p className="text-xs text-muted-foreground">+18 new followers</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>
                                Listening Time
                            </CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
                                432h
                            </div>
                            <p className="text-xs text-muted-foreground">+12h this week</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>
                                Liked Songs
                            </CardTitle>
                            <Heart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>
                                432
                            </div>
                            <p className="text-xs text-muted-foreground">+8 new likes</p>
                        </CardContent>
                    </Card>
                </div>

                <div className={`${isMobile ? 'col-span-1' : isTablet ? 'col-span-2' : 'col-span-6'}`}>
                    <div className="flex flex-col items-center mb-8 mt-16">
                        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                            Recently Played
                        </h2>
                        <p className="text-muted-foreground mt-2">Your latest music discoveries</p>
                    </div>

                    <Carousel
                        opts={{
                            align: "center",
                            loop: true,
                            slidesToScroll: 1,
                            containScroll: "trimSnaps",
                        }}
                        className="w-full max-w-[90vw] mx-auto"
                    >
                        <CarouselContent className="-ml-4 mb-16">
                            {recentlyPlayed.slice(0, 10).map((video) => (
                                <CarouselItem key={video.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
                                    <Card className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                        <div className="aspect-square relative">
                                            <img
                                                src={video.thumbnail}
                                                alt={video.title}
                                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-primary/90 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-primary"
                                                onClick={() => onPlayPause(video)}
                                            >
                                                {currentTrack?.id === video.id && isPlaying ? (
                                                    <Pause className="h-6 w-6" />
                                                ) : (
                                                    <Play className="h-6 w-6" />
                                                )}
                                            </Button>
                                            <span className="absolute top-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded-full">
                                                {video.duration}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                                {video.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">{video.channelTitle}</p>
                                        </div>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="hidden md:flex -left-12" />
                        <CarouselNext className="hidden md:flex -right-12" />
                    </Carousel>
                </div>

                {/* Active Users Section */}
                <div className={`${isMobile ? 'col-span-1' :
                    isTablet ? 'col-span-2' :
                        'col-span-6 lg:col-span-4'
                    }`}>
                    <Card>
                        <CardHeader>
                            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>
                                Active Users
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {users.map((user, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-2 hover:bg-accent rounded-lg transition-colors cursor-pointer ${isMobile ? 'flex-col gap-2' : 'flex-row'
                                            }`}
                                        onClick={() => navigate(`/dashboard/profile/${user.uid}`)}
                                    >
                                        <div className={`flex items-center ${isMobile ? 'flex-col text-center' : 'space-x-4'}`}>
                                            <Avatar className={`${isMobile ? 'h-16 w-16' : 'h-10 w-10'}`}>
                                                <AvatarImage src={user.photoURL} />
                                                <AvatarFallback className="bg-gradient-to-r from-purple-400 to-blue-400 text-white">
                                                    {user.email[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className={isMobile ? 'mt-2' : ''}>
                                                <p className={`font-medium ${isMobile ? 'text-base' : 'text-sm'}`}>
                                                    {user.name || 'Anonymous'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                                <p className="text-xs text-muted-foreground">Role: {user.role}</p>
                                            </div>
                                        </div>
                                        <div className={`flex items-center ${isMobile ? 'w-full justify-center' : 'space-x-2'}`}>
                                            {user.role !== 'admin' && currentUser?.role === 'admin' ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleApprovalToggle(user.uid, user.isApproved);
                                                    }}
                                                    className={`${isMobile ? 'w-full' : 'px-2 py-1'
                                                        } rounded-full text-xs ${user.isApproved
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                        }`}
                                                >
                                                    {user.isApproved ? 'Approved' : 'Pending'}
                                                </Button>
                                            ) : (
                                                <span className={`${isMobile ? 'w-full text-center' : 'px-2 py-1'
                                                    } rounded-full text-xs ${user.isApproved
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {user.isApproved ? 'Approved' : 'Pending'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* User Profile Section */}
                <div className={`${isMobile ? 'col-span-1' :
                    isTablet ? 'col-span-2' :
                        'col-span-6 lg:col-span-2'
                    }`}>
                    <Card>
                        <CardHeader>
                            <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>
                                Profile
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center space-y-4">
                            <Avatar className={`${isMobile ? 'h-24 w-24' : 'h-20 w-20'}`}>
                                <AvatarImage src={currentUser?.photoURL} />
                                <AvatarFallback>{currentUser?.email[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h3 className={`${isMobile ? 'text-xl' : 'text-lg'} font-medium`}>
                                    {currentUser?.displayName || 'User'}
                                </h3>
                                <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                            </div>
                            <div className="w-full space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Profile Completion</span>
                                    <span>85%</span>
                                </div>
                                <Progress value={85} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
