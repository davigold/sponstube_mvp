
import React from 'react';
import { Button, Card, CardContent, Badge } from '../components/Common';
import { Role } from '../types';
import { Sparkles, ArrowRight, LayoutTemplate, Users, Zap, Trophy, Target, PackagePlus, Store, Compass, Rocket } from 'lucide-react';

interface WowMomentProps {
  userRole: Role;
  onFinish: () => void;
}

export default function WowMoment({ userRole, onFinish }: WowMomentProps) {
  const isBrand = userRole === 'brand';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
        {/* Ambient Background */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

      <div className="max-w-5xl w-full relative z-10">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-6">
            <Sparkles size={16} />
            <span>AI Match Complete</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            We found some <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400">perfect matches</span> for you.
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            Based on your profile, we've curated {isBrand ? 'campaign templates and channels' : 'campaign types and brands'} that fit your goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {/* Recommendations based on Role */}
            {isBrand ? (
                <>
                    <Card className="border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-indigo-950/10 hover:border-indigo-400 dark:hover:bg-indigo-950/20 transition-all cursor-pointer group shadow-lg shadow-indigo-500/5">
                        <CardContent className="p-6">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 w-fit rounded-lg text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                                <LayoutTemplate size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Hiring Sprint Template</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Perfect for finding Senior Devs. Includes job description optimization.</p>
                            <Badge variant="brand">High Success Rate</Badge>
                        </CardContent>
                    </Card>

                    <Card className="border-emerald-200 dark:border-emerald-500/30 bg-white dark:bg-emerald-950/10 hover:border-emerald-400 dark:hover:bg-emerald-950/20 transition-all cursor-pointer group shadow-lg shadow-emerald-500/5">
                        <CardContent className="p-6">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-500/20 w-fit rounded-lg text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Tech Channel Bundle</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Access 3 verified Discord/YouTube channels with 50k+ combined devs.</p>
                            <Badge variant="success">Instant Access</Badge>
                        </CardContent>
                    </Card>

                    <Card className="border-amber-200 dark:border-amber-500/30 bg-white dark:bg-amber-950/10 hover:border-amber-400 dark:hover:bg-amber-950/20 transition-all cursor-pointer group shadow-lg shadow-amber-500/5">
                        <CardContent className="p-6">
                            <div className="p-3 bg-amber-100 dark:bg-amber-500/20 w-fit rounded-lg text-amber-600 dark:text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                                <Target size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Product Feedback</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Get 50 detailed reviews from power users in 7 days.</p>
                            <Badge variant="warning">Trending</Badge>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <>
                    <Card className="border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-indigo-950/10 hover:border-indigo-400 dark:hover:bg-indigo-950/20 transition-all cursor-pointer group shadow-lg shadow-indigo-500/5">
                        <CardContent className="p-6">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-500/20 w-fit rounded-lg text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Flash Deals Campaign</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Your audience loves discounts. Monetize without spam.</p>
                            <Badge variant="brand">Easy Setup</Badge>
                        </CardContent>
                    </Card>

                    <Card className="border-purple-200 dark:border-purple-500/30 bg-white dark:bg-purple-950/10 hover:border-purple-400 dark:hover:bg-purple-950/20 transition-all cursor-pointer group shadow-lg shadow-purple-500/5">
                        <CardContent className="p-6">
                            <div className="p-3 bg-purple-100 dark:bg-purple-500/20 w-fit rounded-lg text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                                <Trophy size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Sponsored Challenges</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Engage members with contests sponsored by SaaS brands.</p>
                            <Badge variant="neutral">High Engagement</Badge>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-blue-200 dark:border-blue-500/30 bg-white dark:bg-blue-950/10 hover:border-blue-400 dark:hover:bg-blue-950/20 transition-all cursor-pointer group shadow-lg shadow-blue-500/5">
                        <CardContent className="p-6">
                            <div className="p-3 bg-blue-100 dark:bg-blue-500/20 w-fit rounded-lg text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                                <LayoutTemplate size={24} />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Job Board Add-on</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Automatically post relevant jobs and get paid per click.</p>
                            <Badge variant="success">Recurring Revenue</Badge>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>

        {/* GUIDED CTAs SECTION */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            {isBrand ? (
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center">
                    <Button 
                        size="lg" 
                        onClick={onFinish} 
                        className="px-8 py-6 text-lg shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:shadow-[0_0_50px_rgba(79,70,229,0.6)] flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500"
                        icon={<Rocket className="ml-1" />}
                    >
                        Create my first campaign now
                    </Button>
                    <Button 
                        size="lg" 
                        variant="secondary"
                        onClick={onFinish} 
                        className="px-8 py-6 text-lg border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 flex-1"
                        icon={<Compass className="ml-1" />}
                    >
                        Explore recommended channels
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg justify-center">
                    <Button 
                        size="lg" 
                        onClick={onFinish} 
                        className="px-8 py-6 text-lg shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.6)] flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500"
                        icon={<PackagePlus className="ml-1" />}
                    >
                        Create my first packages
                    </Button>
                    <Button 
                        size="lg" 
                        variant="secondary"
                        onClick={onFinish} 
                        className="px-8 py-6 text-lg border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex-1"
                        icon={<Store className="ml-1" />}
                    >
                        Configure my storefront
                    </Button>
                </div>
            )}
            <p className="text-slate-500 text-sm mt-4">Or go straight to <button onClick={onFinish} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline underline-offset-4">Dashboard</button></p>
        </div>
      </div>
    </div>
  );
}
