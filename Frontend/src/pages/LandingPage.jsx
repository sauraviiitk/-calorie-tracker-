import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface-bright/85 backdrop-blur-xl border-b border-surface-variant/40 shadow-[0_1px_8px_rgba(0,0,0,0.03)]"><div className="h-20 max-w-[1320px] mx-auto px-gutter-mobile lg:px-margin flex items-center justify-between gap-space-md"><div className="flex items-center gap-space-xl"><Link className="flex items-center gap-space-xs group" data-path="home" to="/signup"><div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-primary transition-transform group-hover:scale-105 shadow-[0_2px_8px_rgba(126,87,194,0.12)]"><span className="material-symbols-outlined text-[20px]">spa</span></div><span className="font-title-lg text-title-lg text-on-surface tracking-tight">Calorie<span className="text-primary font-bold">Mate</span></span></Link><nav className="hidden lg:flex items-center gap-space-xs" data-active-classes="bg-secondary-container text-primary font-medium rounded-full px-space-sm py-1.5 shadow-sm"><Link aria-current="page" className="transition-colors bg-secondary-container text-primary font-medium rounded-full px-space-sm py-1.5 shadow-sm" data-path="home" to="/signup">Home</Link><Link className="px-space-sm py-1.5 font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors rounded-full" data-path="calculator" to="/signup">Calculator</Link><Link className="px-space-sm py-1.5 font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors rounded-full" data-path="food-diary" to="/signup">Food Diary</Link><Link className="px-space-sm py-1.5 font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors rounded-full" data-path="meal-planner" to="/signup">Meal Planner</Link><Link className="px-space-sm py-1.5 font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors rounded-full" data-path="calendar" to="/signup">Calendar</Link><Link className="px-space-sm py-1.5 font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors rounded-full" data-path="progress" to="/signup">Progress</Link></nav></div><div className="flex items-center gap-space-sm"><Link className="px-space-sm py-2 font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" to="/login">Sign In</Link><Link className="h-10 px-space-md rounded-full bg-primary text-on-primary font-body-sm text-body-sm flex items-center justify-center transition-all hover:bg-primary-container shadow-[0_4px_14px_rgba(126,87,194,0.22)] active:scale-95" to="/signup">Get Started</Link><div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 ml-1"><span className="material-symbols-outlined text-on-primary text-[18px]">person</span></div></div></div></header><main className="w-full pt-20 bg-surface"><div className="flex flex-col w-full overflow-hidden">

<section className="relative w-full max-w-[1320px] mx-auto px-gutter-mobile lg:px-margin py-space-xl lg:py-24">

<div className="absolute top-12 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-tr from-secondary-container/40 via-primary-fixed/20 to-transparent blur-3xl -z-10 rounded-full pointer-events-none"></div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-12 items-center">

<div className="lg:col-span-6 flex flex-col items-start gap-space-md">

<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container/70 shadow-sm">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span className="font-label-sm text-label-sm text-primary tracking-wider uppercase font-semibold">Personalized Nutrition, Simplified</span>
</div>

<h1 className="font-display-hero text-display-hero-mobile lg:text-display-hero text-on-surface tracking-tight">
          Know exactly what <br className="hidden sm:inline" />
<span className="text-primary bg-secondary-container/60 px-2.5 py-0.5 rounded-xl inline-block mt-1">your body needs.</span>
</h1>

<p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
          Calculate your daily calorie needs, track your meals, and understand your nutrition progress in one simple, serene space.
        </p>

<div className="flex flex-wrap items-center gap-space-sm pt-2 w-full sm:w-auto">
<Link className="h-12 px-space-lg rounded-full bg-primary text-on-primary font-title-md text-title-md inline-flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(101,61,167,0.25)] hover:bg-primary-container transition-all hover:scale-[1.02] active:scale-95" data-path="calculator" to="/signup">
<span>Calculate My Calories</span>
<span className="material-symbols-outlined text-[20px]">arrow_forward</span>
</Link>
<a className="h-12 px-space-md rounded-full bg-surface-container-lowest text-on-surface font-title-md text-title-md inline-flex items-center justify-center gap-1.5 shadow-sm hover:bg-surface-container transition-all" href="#features">
<span>Explore Features</span>
</a>
</div>

<div className="pt-3 flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-[18px]">verified</span>
<span>Simple</span>
</div>
<span className="text-outline-variant">•</span>
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-[18px]">tune</span>
<span>Personalized</span>
</div>
<span className="text-outline-variant">•</span>
<div className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-primary text-[18px]">timelapse</span>
<span>Built for consistency</span>
</div>
</div>
</div>

<div className="lg:col-span-6 relative flex justify-center lg:justify-end mt-6 lg:mt-0">
<div className="relative w-full max-w-[540px] aspect-[4/3] sm:aspect-[1.18] rounded-[2.5rem] p-3 bg-surface-container-lowest shadow-[0_16px_40px_-10px_rgba(101,61,167,0.08)]">

<div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-inner bg-surface-container">
<img alt="Nourish bowl with grilled salmon, edamame, avocado, and quinoa" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCezjbjKwaVJ4MEZDklL8ddcpDB0K6gIGe4YRmc_GhPR398UOEJLmmFkdD8i9vX6qEyReONl7qM1fCP4iN_kxCzmBXL8TGMW8WX2HsGb9AMCnSFQF9kaYDLbZGX7kSab4WsDmv1H29qwYlOeW_eNB3s60a7ZKyLZ4kcunE5VTe4oFkI2pP_cdguiSpwT8xceH5LuqqX7IcHk5VloNr19r3W2P7iwimOCIhODRsRGbQlNloRZnH1-oxp" />
<div className="absolute inset-0 bg-gradient-to-t from-on-surface/30 via-transparent to-transparent opacity-60"></div>
</div>

<div className="absolute -top-4 -left-3 sm:-left-6 bg-surface-container-lowest/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-[0_10px_25px_-5px_rgba(33,23,44,0.08)] flex items-center gap-3">
<div className="relative w-11 h-11 flex items-center justify-center">
<svg className="w-11 h-11 -rotate-90" viewBox="0 0 36 36">
<circle className="stroke-surface-container" cx="18" cy="18" fill="none" r="15" strokeWidth="3" />
<circle className="stroke-primary" cx="18" cy="18" fill="none" r="15" strokeDasharray="94.25" strokeDashoffset="24" strokeLinecap="round" strokeWidth="3" />
</svg>
<span className="material-symbols-outlined absolute text-[16px] text-primary">local_fire_department</span>
</div>
<div>
<p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Daily Target</p>
<p className="font-title-md text-title-md text-on-surface font-bold">2,200 <span className="font-label-sm text-label-sm font-normal text-secondary">kcal</span></p>
</div>
</div>

<div className="absolute -bottom-4 left-4 sm:left-8 bg-surface-container-lowest/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-[0_10px_25px_-5px_rgba(33,23,44,0.08)] flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-[#FFE5D9] flex items-center justify-center text-[#B74747]">
<span className="material-symbols-outlined text-[16px]">fitness_center</span>
</div>
<div>
<div className="flex items-center justify-between gap-3">
<span className="font-label-sm text-label-sm font-semibold text-[#B74747]">Protein</span>
<span className="font-label-sm text-label-sm text-on-surface font-medium">128g / 140g</span>
</div>
<div className="w-28 h-1.5 rounded-full bg-surface-container mt-1.5 overflow-hidden">
<div className="h-full bg-gradient-to-r from-[#FFE5D9] to-[#B74747] rounded-full w-[91%]"></div>
</div>
</div>
</div>

<div className="absolute top-1/3 -right-2 sm:-right-6 bg-surface-container-lowest/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-[0_10px_25px_-5px_rgba(33,23,44,0.08)] flex items-center gap-2">
<span className="w-2.5 h-2.5 rounded-full bg-[#3B7A3E] animate-pulse"></span>
<span className="font-label-sm text-label-sm font-semibold text-on-surface">82% on track</span>
</div>
</div>
</div>
</div>

<div className="mt-16 sm:mt-24 pt-8 max-w-4xl mx-auto flex items-center justify-between px-6 py-4 rounded-3xl bg-surface-container-lowest/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)] backdrop-blur-sm">
<div className="flex items-center gap-2 sm:gap-3">
<div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center font-label-sm text-label-sm font-bold text-primary">1</div>
<span className="font-title-md text-title-md text-on-surface tracking-tight">Calculate</span>
</div>
<span className="material-symbols-outlined text-outline-variant text-[18px]">trending_flat</span>
<div className="flex items-center gap-2 sm:gap-3">
<div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center font-label-sm text-label-sm font-bold text-primary">2</div>
<span className="font-title-md text-title-md text-on-surface tracking-tight">Track</span>
</div>
<span className="material-symbols-outlined text-outline-variant text-[18px]">trending_flat</span>
<div className="flex items-center gap-2 sm:gap-3">
<div className="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center font-label-sm text-label-sm font-bold text-primary">3</div>
<span className="font-title-md text-title-md text-on-surface tracking-tight">Improve</span>
</div>
</div>
</section>

<section className="w-full bg-surface-container-low py-space-xl lg:py-24" id="features">
<div className="max-w-[1320px] mx-auto px-gutter-mobile lg:px-margin">

<div className="text-center max-w-2xl mx-auto mb-space-xl">
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest bg-secondary-container/70 px-3 py-1 rounded-full">Comprehensive Suite</span>
<h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mt-3 tracking-tight">Everything you need to stay on track.</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-2">Built to replace cluttered spreadsheets and aggressive fitness apps with a calm, deliberate workflow.</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_4px_20px_-2px_rgba(101,61,167,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(101,61,167,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-2xl bg-[#E8D8F5] flex items-center justify-center text-primary mb-6">
<span className="material-symbols-outlined text-[24px]">calculate</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mb-2 font-semibold">Calorie Calculator</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Calculate BMR, TDEE, and your tailored daily calorie requirement using gold-standard physiological formulas.</p>
</div>
<div className="mt-6 pt-4 flex items-center gap-1.5 text-primary font-label-md text-label-md font-semibold">
<span>Explore calculations</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</div>
</div>

<div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_4px_20px_-2px_rgba(101,61,167,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(101,61,167,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-2xl bg-[#E2F0D9] flex items-center justify-center text-[#3B7A3E] mb-6">
<span className="material-symbols-outlined text-[24px]">menu_book</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mb-2 font-semibold">Food Diary</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Track meals and daily intake with frictionless precision, smart quantity suggestions, and zero cognitive bloat.</p>
</div>
<div className="mt-6 pt-4 flex items-center gap-1.5 text-tertiary font-label-md text-label-md font-semibold">
<span>Discover logging</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</div>
</div>

<div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_4px_20px_-2px_rgba(101,61,167,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(101,61,167,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-2xl bg-[#FFE5D9] flex items-center justify-center text-[#B74747] mb-6">
<span className="material-symbols-outlined text-[24px]">pie_chart</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mb-2 font-semibold">Macro Tracking</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Keep tabs on protein, carbohydrates, and healthy fats with gentle, soothing visual ratios that guide your choices.</p>
</div>
<div className="mt-6 pt-4 flex items-center gap-1.5 text-[#B74747] font-label-md text-label-md font-semibold">
<span>Inspect macro ratios</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</div>
</div>

<div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_4px_20px_-2px_rgba(101,61,167,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(101,61,167,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-2xl bg-[#DCEBFA] flex items-center justify-center text-[#2A6EB0] mb-6">
<span className="material-symbols-outlined text-[24px]">calendar_view_week</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mb-2 font-semibold">Meal Planner</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Organize meals around your dynamic lifestyle. Prep grocery lists and plan your week without the Sunday stress.</p>
</div>
<div className="mt-6 pt-4 flex items-center gap-1.5 text-[#2A6EB0] font-label-md text-label-md font-semibold">
<span>Preview scheduling</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</div>
</div>

<div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_4px_20px_-2px_rgba(101,61,167,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(101,61,167,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-2xl bg-[#FEF3D6] flex items-center justify-center text-[#8D6800] mb-6">
<span className="material-symbols-outlined text-[24px]">event_note</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mb-2 font-semibold">Nutrition Calendar</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Review your nutrition day-by-day with serene color-coded consistency rings that celebrate continuous progress.</p>
</div>
<div className="mt-6 pt-4 flex items-center gap-1.5 text-[#8D6800] font-label-md text-label-md font-semibold">
<span>View historical heatmaps</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</div>
</div>

<div className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_4px_20px_-2px_rgba(101,61,167,0.03)] hover:shadow-[0_12px_28px_-6px_rgba(101,61,167,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
<div>
<div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center text-primary mb-6">
<span className="material-symbols-outlined text-[24px]">trending_up</span>
</div>
<h3 className="font-title-lg text-title-lg text-on-surface mb-2 font-semibold">Progress Tracking</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Understand trends, weight rolling averages, and biological rhythm shifts over 30, 60, and 90-day intervals.</p>
</div>
<div className="mt-6 pt-4 flex items-center gap-1.5 text-primary font-label-md text-label-md font-semibold">
<span>See analytics tools</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</div>
</div>
</div>
</div>
</section>

<section className="w-full py-space-xl lg:py-24 bg-surface">
<div className="max-w-[1320px] mx-auto px-gutter-mobile lg:px-margin">

<div className="text-center max-w-2xl mx-auto mb-space-xl">
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest bg-secondary-container/70 px-3 py-1 rounded-full">Intuitive Dashboard</span>
<h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mt-3 tracking-tight">Your nutrition, at a glance.</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-2">A calm, unified interface showing real-time balance without sensory overload.</p>
</div>

<div className="w-full bg-surface-container-lowest rounded-[2rem] shadow-[0_20px_50px_-15px_rgba(33,23,44,0.07)] p-2 sm:p-4 overflow-hidden">

<div className="h-10 px-4 flex items-center justify-between border-b border-surface-container">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
<span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
<span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
<span className="ml-3 font-label-sm text-label-sm text-outline hidden sm:inline">caloriemate.app/dashboard</span>
</div>
<div className="flex items-center gap-2 text-outline">
<span className="material-symbols-outlined text-[18px]">lock</span>
<span className="font-label-sm text-label-sm">Secure Session</span>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px] bg-surface-container-low/40 rounded-b-[1.5rem]">

<div className="hidden lg:flex lg:col-span-3 bg-surface-container-lowest p-6 flex-col justify-between">
<div className="flex flex-col gap-6">

<div className="flex items-center gap-3 px-2">
<img alt="CalorieMate Logo" className="w-8 h-8 rounded-lg shadow-sm" src="https://lh3.googleusercontent.com/aida/AEtjO1UKiSqs1ePbWila33m0bkn-vBb-dT46PFqErzduzCi138qVxpZ7n_orAwYJoeB04l64P5mXeFgWKCq1IT2JTzObRe-w44cM0wFeHFHDo1FF8_uhZIAeLZ-etI26Gn-V2U8uo7whluOLqKkMvmtu-2YyeqfYGxUgGZMkWPHxS4BxBhWUue6y-yNLTpedFOYA37H_0WdDYB1sHsZQPrPbPKlxsyAR1MTryXAqOWxZcVKKuEmVnFplBs8uTQ" />
<span className="font-title-lg text-title-lg font-bold text-on-surface tracking-tight">Calorie<span className="text-primary font-bold">Mate</span></span>
</div>

<nav className="flex flex-col gap-1.5">
<Link className="flex items-center gap-3 px-3.5 py-2.5 rounded-full bg-secondary-container text-primary font-medium text-body-sm shadow-sm" to="/signup">
<span className="material-symbols-outlined text-[20px]">grid_view</span>
<span>Dashboard</span>
</Link>
<Link className="flex items-center gap-3 px-3.5 py-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm" to="/signup">
<span className="material-symbols-outlined text-[20px]">calculate</span>
<span>Calorie Calculator</span>
</Link>
<Link className="flex items-center gap-3 px-3.5 py-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm" to="/signup">
<span className="material-symbols-outlined text-[20px]">menu_book</span>
<span>Food Diary</span>
</Link>
<Link className="flex items-center gap-3 px-3.5 py-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm" to="/signup">
<span className="material-symbols-outlined text-[20px]">calendar_view_week</span>
<span>Meal Planner</span>
</Link>
<Link className="flex items-center gap-3 px-3.5 py-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm" to="/signup">
<span className="material-symbols-outlined text-[20px]">event_note</span>
<span>Calendar</span>
</Link>
<Link className="flex items-center gap-3 px-3.5 py-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm" to="/signup">
<span className="material-symbols-outlined text-[20px]">insights</span>
<span>Progress</span>
</Link>
<Link className="flex items-center gap-3 px-3.5 py-2.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors text-body-sm" to="/signup">
<span className="material-symbols-outlined text-[20px]">settings</span>
<span>Settings</span>
</Link>
</nav>
</div>

<div className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface-container-low">
<div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-label-md">S</div>
<div className="flex flex-col min-w-0">
<span className="font-title-md text-title-md text-on-surface truncate leading-tight">Sarah Jenkins</span>
<span className="font-label-sm text-label-sm text-on-surface-variant truncate">Standard Plan</span>
</div>
</div>
</div>

<div className="lg:col-span-9 p-4 sm:p-8 flex flex-col gap-6">

<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
<div>
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold tracking-tight">Welcome back, Sarah</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Wednesday, Oct 24 • You have 670 kcal remaining</p>
</div>
<div className="flex items-center gap-3">
<button className="h-10 px-4 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center gap-2 shadow-sm hover:bg-primary-container transition-all">
<span className="material-symbols-outlined text-[18px]">add</span>
<span>Quick Add</span>
</button>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

<div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant">Daily Calorie Goal</span>
<span className="material-symbols-outlined text-[18px] text-outline">flag</span>
</div>
<div className="mt-3">
<span className="font-numeric-metric text-numeric-metric text-on-surface font-bold">2,150</span>
<span className="font-label-sm text-label-sm text-on-surface-variant ml-1">kcal</span>
</div>
<div className="mt-2 text-outline font-label-sm text-label-sm">Based on moderate activity</div>
</div>

<div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant">Consumed</span>
<span className="font-label-sm text-label-sm font-semibold text-primary">68%</span>
</div>
<div className="mt-3">
<span className="font-numeric-metric text-numeric-metric text-on-surface font-bold">1,480</span>
<span className="font-label-sm text-label-sm text-on-surface-variant ml-1">kcal</span>
</div>
<div className="w-full h-1.5 rounded-full bg-surface-container mt-2 overflow-hidden">
<div className="h-full bg-primary rounded-full w-[68%]"></div>
</div>
</div>

<div className="bg-secondary-container/40 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
<div className="flex items-center justify-between">
<span className="font-label-md text-label-md text-primary font-semibold">Remaining</span>
<span className="material-symbols-outlined text-[18px] text-primary">hourglass_top</span>
</div>
<div className="mt-3">
<span className="font-numeric-metric text-numeric-metric text-primary font-bold">670</span>
<span className="font-label-sm text-label-sm text-primary ml-1">kcal</span>
</div>
<div className="mt-2 text-on-secondary-container font-label-sm text-label-sm">Room for evening meal</div>
</div>
</div>

<div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm">
<div className="flex items-center justify-between mb-4">
<h4 className="font-title-md text-title-md text-on-surface font-semibold">Macronutrient Distribution</h4>
<span className="font-label-sm text-label-sm text-on-surface-variant">Daily Targets</span>
</div>
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

<div className="p-3.5 rounded-xl bg-[#FFF8F5]">
<div className="flex items-center justify-between">
<span className="px-2 py-0.5 rounded-full bg-[#FFE5D9] text-[#B74747] font-label-sm text-label-sm font-semibold">Protein</span>
<span className="font-label-md text-label-md font-bold text-on-surface">118g <span className="font-normal text-outline">/ 145g</span></span>
</div>
<div className="w-full h-2 rounded-full bg-surface-container mt-3 overflow-hidden">
<div className="h-full bg-[#B74747] rounded-full w-[81%]"></div>
</div>
</div>

<div className="p-3.5 rounded-xl bg-[#F5FAFF]">
<div className="flex items-center justify-between">
<span className="px-2 py-0.5 rounded-full bg-[#DCEBFA] text-[#2A6EB0] font-label-sm text-label-sm font-semibold">Carbs</span>
<span className="font-label-md text-label-md font-bold text-on-surface">165g <span className="font-normal text-outline">/ 220g</span></span>
</div>
<div className="w-full h-2 rounded-full bg-surface-container mt-3 overflow-hidden">
<div className="h-full bg-[#2A6EB0] rounded-full w-[75%]"></div>
</div>
</div>

<div className="p-3.5 rounded-xl bg-[#FFFDF5]">
<div className="flex items-center justify-between">
<span className="px-2 py-0.5 rounded-full bg-[#FEF3D6] text-[#8D6800] font-label-sm text-label-sm font-semibold">Fat</span>
<span className="font-label-md text-label-md font-bold text-on-surface">42g <span className="font-normal text-outline">/ 65g</span></span>
</div>
<div className="w-full h-2 rounded-full bg-surface-container mt-3 overflow-hidden">
<div className="h-full bg-[#8D6800] rounded-full w-[64%]"></div>
</div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm">
<div className="flex items-center justify-between mb-4">
<h4 className="font-title-md text-title-md text-on-surface font-semibold">Today's Meals</h4>
<Link className="font-label-sm text-label-sm text-primary font-semibold hover:underline" to="/signup">View Diary</Link>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
<div className="p-3 rounded-xl bg-surface-container-low flex flex-col justify-between">
<div>
<span className="font-label-sm text-label-sm text-outline font-semibold uppercase">Breakfast</span>
<p className="font-body-sm text-body-sm font-medium text-on-surface mt-1 truncate">Avocado Toast &amp; Poached Eggs</p>
</div>
<p className="font-label-sm text-label-sm font-bold text-primary mt-3">480 kcal</p>
</div>
<div className="p-3 rounded-xl bg-surface-container-low flex flex-col justify-between">
<div>
<span className="font-label-sm text-label-sm text-outline font-semibold uppercase">Lunch</span>
<p className="font-body-sm text-body-sm font-medium text-on-surface mt-1 truncate">Salmon Quinoa Bowl</p>
</div>
<p className="font-label-sm text-label-sm font-bold text-primary mt-3">620 kcal</p>
</div>
<div className="p-3 rounded-xl bg-surface-container-low/70 flex flex-col justify-between border-dashed">
<div>
<span className="font-label-sm text-label-sm text-primary font-semibold uppercase flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">schedule</span> Scheduled
                    </span>
<p className="font-body-sm text-body-sm font-medium text-on-surface mt-1 truncate">Grilled Chicken &amp; Sweet Potato</p>
</div>
<p className="font-label-sm text-label-sm font-bold text-outline mt-3">380 kcal</p>
</div>
<div className="p-3 rounded-xl bg-surface-container-low flex flex-col justify-between">
<div>
<span className="font-label-sm text-label-sm text-outline font-semibold uppercase">Snacks</span>
<p className="font-body-sm text-body-sm font-medium text-on-surface mt-1 truncate">Greek Yogurt &amp; Berries</p>
</div>
<p className="font-label-sm text-label-sm font-bold text-primary mt-3">180 kcal</p>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="w-full py-space-xl lg:py-24 bg-surface-container-low">
<div className="max-w-[1320px] mx-auto px-gutter-mobile lg:px-margin">

<div className="text-center max-w-2xl mx-auto mb-space-xl">
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest bg-secondary-container/70 px-3 py-1 rounded-full">Personalized Targets</span>
<h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mt-3 tracking-tight">Get a calorie target made for you.</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-2">Adjust your biological parameters and observe instant recalculation backed by clinical nutritional science.</p>
</div>

<div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">

<div className="md:col-span-7 bg-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between">
<div className="flex flex-col gap-5">

<div>
<label className="font-label-sm text-label-sm text-on-surface-variant font-semibold block mb-2">Biological Sex</label>
<div className="grid grid-cols-3 gap-2 p-1 bg-surface-container rounded-2xl">
<button className="py-2 rounded-xl bg-surface-container-lowest shadow-sm font-label-md text-label-md font-semibold text-primary" type="button">Female</button>
<button className="py-2 rounded-xl text-on-surface-variant font-label-md text-label-md hover:text-on-surface" type="button">Male</button>
<button className="py-2 rounded-xl text-on-surface-variant font-label-md text-label-md hover:text-on-surface" type="button">Other</button>
</div>
</div>

<div className="grid grid-cols-2 gap-4">
<div>
<label className="font-label-sm text-label-sm text-on-surface-variant font-semibold block mb-2">Age</label>
<div className="h-12 px-4 rounded-xl bg-surface-container-low flex items-center justify-between">
<span className="font-title-md text-title-md text-on-surface">28</span>
<span className="font-label-sm text-label-sm text-outline">years</span>
</div>
</div>
<div>
<label className="font-label-sm text-label-sm text-on-surface-variant font-semibold block mb-2">Weight</label>
<div className="h-12 px-4 rounded-xl bg-surface-container-low flex items-center justify-between">
<span className="font-title-md text-title-md text-on-surface">145</span>
<span className="font-label-sm text-label-sm text-outline">lbs (66 kg)</span>
</div>
</div>
</div>

<div>
<label className="font-label-sm text-label-sm text-on-surface-variant font-semibold block mb-2">Height</label>
<div className="h-12 px-4 rounded-xl bg-surface-container-low flex items-center justify-between">
<span className="font-title-md text-title-md text-on-surface">5 ft 8 in</span>
<span className="font-label-sm text-label-sm text-outline">173 cm</span>
</div>
</div>

<div>
<label className="font-label-sm text-label-sm text-on-surface-variant font-semibold block mb-2">Activity Level</label>
<div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[18px]">directions_run</span>
</div>
<div>
<p className="font-title-md text-title-md text-on-surface text-[14px]">Moderate Exercise</p>
<p className="font-label-sm text-label-sm text-outline">3–5 days per week</p>
</div>
</div>
<span className="material-symbols-outlined text-outline text-[20px]">expand_more</span>
</div>
</div>

<div>
<label className="font-label-sm text-label-sm text-on-surface-variant font-semibold block mb-2">Goal Strategy</label>
<div className="grid grid-cols-3 gap-2">
<div className="p-2.5 rounded-xl bg-surface-container-low text-center font-label-sm text-label-sm text-on-surface-variant">Maintenance</div>
<div className="p-2.5 rounded-xl bg-secondary-container text-center font-label-sm text-label-sm font-semibold text-primary shadow-sm">Steady Fat Loss</div>
<div className="p-2.5 rounded-xl bg-surface-container-low text-center font-label-sm text-label-sm text-on-surface-variant">Muscle Gain</div>
</div>
</div>
</div>
<button className="mt-6 w-full h-11 rounded-full bg-primary text-on-primary font-title-md text-title-md flex items-center justify-center gap-2 shadow-md hover:bg-primary-container transition-all">
<span>Calculate Nutrition Plan</span>
<span className="material-symbols-outlined text-[18px]">auto_awesome</span>
</button>
</div>

<div className="md:col-span-5 bg-gradient-to-b from-secondary-container/40 to-surface-container-lowest p-6 sm:p-8 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between">
<div>
<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm font-semibold mb-6">
<span className="material-symbols-outlined text-[14px]">insights</span>
<span>Personalized Output</span>
</div>
<div className="space-y-4">

<div className="flex items-center justify-between pb-3 border-b border-surface-container">
<span className="font-body-sm text-body-sm text-on-surface-variant">Basal Metabolic Rate (BMR)</span>
<span className="font-title-md text-title-md text-on-surface font-semibold">1,485 <span className="font-normal text-outline text-[12px]">kcal</span></span>
</div>

<div className="flex items-center justify-between pb-3 border-b border-surface-container">
<span className="font-body-sm text-body-sm text-on-surface-variant">Maintenance (TDEE)</span>
<span className="font-title-md text-title-md text-on-surface font-semibold">2,240 <span className="font-normal text-outline text-[12px]">kcal</span></span>
</div>

<div className="p-6 rounded-2xl bg-surface-container-lowest shadow-sm my-6 text-center">
<span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">Your Daily Target</span>
<div className="my-2">
<span className="font-display-hero text-display-hero text-primary font-bold tracking-tight">1,990</span>
<span className="font-title-lg text-title-lg text-secondary font-medium ml-1">kcal</span>
</div>
<p className="font-label-sm text-label-sm text-outline">Mild 250 kcal deficit for safe, sustainable fat loss</p>
</div>

<div>
<span className="font-label-sm text-label-sm text-on-surface-variant font-semibold block mb-3">Recommended Macronutrient Split</span>
<div className="grid grid-cols-3 gap-2 text-center">
<div className="p-2.5 rounded-xl bg-[#FFE5D9]/50">
<p className="font-label-sm text-label-sm text-[#B74747] font-semibold">Protein</p>
<p className="font-title-md text-title-md text-on-surface font-bold mt-1">130g</p>
</div>
<div className="p-2.5 rounded-xl bg-[#DCEBFA]/50">
<p className="font-label-sm text-label-sm text-[#2A6EB0] font-semibold">Carbs</p>
<p className="font-title-md text-title-md text-on-surface font-bold mt-1">210g</p>
</div>
<div className="p-2.5 rounded-xl bg-[#FEF3D6]/50">
<p className="font-label-sm text-label-sm text-[#8D6800] font-semibold">Fat</p>
<p className="font-title-md text-title-md text-on-surface font-bold mt-1">55g</p>
</div>
</div>
</div>
</div>
</div>
<div className="mt-6 pt-4 text-center">
<span className="font-label-sm text-label-sm text-outline flex items-center justify-center gap-1">
<span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
              Mifflin-St Jeor clinical standard formula
            </span>
</div>
</div>
</div>
</div>
</section>

<section className="w-full py-space-xl lg:py-24 bg-surface">
<div className="max-w-[1320px] mx-auto px-gutter-mobile lg:px-margin">

<div className="text-center max-w-2xl mx-auto mb-space-xl">
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest bg-secondary-container/70 px-3 py-1 rounded-full">Effortless Logging</span>
<h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mt-3 tracking-tight">Know what you're eating.</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-2">Log nutrient-dense meals in seconds with clean macro pills, micro-gram metrics, and zero clutter.</p>
</div>

<div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(33,23,44,0.04)]">

<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-surface-container">
<div className="relative w-full sm:w-80">
<span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
<input className="w-full h-11 pl-11 pr-4 rounded-full bg-surface-container-low text-body-sm font-body-sm text-on-surface focus:outline-none placeholder:text-outline" disabled="" placeholder="Search foods or barcode scan..." type="text" />
</div>
<button className="w-full sm:w-auto h-11 px-5 rounded-full bg-secondary-container text-primary font-title-md text-title-md flex items-center justify-center gap-2 hover:bg-secondary-fixed-dim transition-colors shadow-sm">
<span className="material-symbols-outlined text-[18px]">add</span>
<span>+ Add Food</span>
</button>
</div>

<div className="mt-6 space-y-4">

<div className="p-5 rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
<div className="flex items-start gap-4">
<div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[20px]">bakery_dining</span>
</div>
<div>
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm font-bold text-secondary uppercase tracking-wider">Breakfast</span>
<span className="text-outline-variant">•</span>
<span className="font-label-sm text-label-sm text-outline">8:15 AM</span>
</div>
<h4 className="font-title-md text-title-md text-on-surface mt-0.5">Steel-cut Oats with Almond Butter, Banana &amp; Blueberries</h4>
<div className="flex flex-wrap items-center gap-2 mt-2">
<span className="px-2.5 py-0.5 rounded-full bg-[#FFE5D9] text-[#B74747] font-label-sm text-label-sm font-semibold">P: 14g</span>
<span className="px-2.5 py-0.5 rounded-full bg-[#DCEBFA] text-[#2A6EB0] font-label-sm text-label-sm font-semibold">C: 62g</span>
<span className="px-2.5 py-0.5 rounded-full bg-[#FEF3D6] text-[#8D6800] font-label-sm text-label-sm font-semibold">F: 12g</span>
</div>
</div>
</div>
<div className="flex items-center gap-4 self-end md:self-center">
<span className="font-title-lg text-title-lg font-bold text-on-surface">420 <span className="font-label-sm text-label-sm font-normal text-outline">kcal</span></span>
<button className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline transition-colors"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
</div>
</div>

<div className="p-5 rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
<div className="flex items-start gap-4">
<div className="w-10 h-10 rounded-xl bg-[#E2F0D9] flex items-center justify-center text-[#3B7A3E] shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[20px]">lunch_dining</span>
</div>
<div>
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm font-bold text-[#3B7A3E] uppercase tracking-wider">Lunch</span>
<span className="text-outline-variant">•</span>
<span className="font-label-sm text-label-sm text-outline">12:45 PM</span>
</div>
<h4 className="font-title-md text-title-md text-on-surface mt-0.5">Grilled Salmon Fillet, Edamame, Avocado &amp; Brown Rice</h4>
<div className="flex flex-wrap items-center gap-2 mt-2">
<span className="px-2.5 py-0.5 rounded-full bg-[#FFE5D9] text-[#B74747] font-label-sm text-label-sm font-semibold">P: 44g</span>
<span className="px-2.5 py-0.5 rounded-full bg-[#DCEBFA] text-[#2A6EB0] font-label-sm text-label-sm font-semibold">C: 52g</span>
<span className="px-2.5 py-0.5 rounded-full bg-[#FEF3D6] text-[#8D6800] font-label-sm text-label-sm font-semibold">F: 24g</span>
</div>
</div>
</div>
<div className="flex items-center gap-4 self-end md:self-center">
<span className="font-title-lg text-title-lg font-bold text-on-surface">640 <span className="font-label-sm text-label-sm font-normal text-outline">kcal</span></span>
<button className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline transition-colors"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
</div>
</div>

<div className="p-5 rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
<div className="flex items-start gap-4">
<div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[20px]">dinner_dining</span>
</div>
<div>
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm font-bold text-secondary uppercase tracking-wider">Dinner</span>
<span className="text-outline-variant">•</span>
<span className="font-label-sm text-label-sm text-outline">7:00 PM</span>
</div>
<h4 className="font-title-md text-title-md text-on-surface mt-0.5">Roasted Herb Chicken Breast with Steamed Asparagus &amp; Sweet Potatoes</h4>
<div className="flex flex-wrap items-center gap-2 mt-2">
<span className="px-2.5 py-0.5 rounded-full bg-[#FFE5D9] text-[#B74747] font-label-sm text-label-sm font-semibold">P: 48g</span>
<span className="px-2.5 py-0.5 rounded-full bg-[#DCEBFA] text-[#2A6EB0] font-label-sm text-label-sm font-semibold">C: 42g</span>
<span className="px-2.5 py-0.5 rounded-full bg-[#FEF3D6] text-[#8D6800] font-label-sm text-label-sm font-semibold">F: 11g</span>
</div>
</div>
</div>
<div className="flex items-center gap-4 self-end md:self-center">
<span className="font-title-lg text-title-lg font-bold text-on-surface">510 <span className="font-label-sm text-label-sm font-normal text-outline">kcal</span></span>
<button className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline transition-colors"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
</div>
</div>

<div className="p-5 rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
<div className="flex items-start gap-4">
<div className="w-10 h-10 rounded-xl bg-[#FEF3D6] flex items-center justify-center text-[#8D6800] shrink-0 mt-0.5">
<span className="material-symbols-outlined text-[20px]">cookie</span>
</div>
<div>
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm font-bold text-[#8D6800] uppercase tracking-wider">Snacks</span>
<span className="text-outline-variant">•</span>
<span className="font-label-sm text-label-sm text-outline">3:30 PM</span>
</div>
<h4 className="font-title-md text-title-md text-on-surface mt-0.5">Protein Smoothie &amp; Mixed Walnuts</h4>
<div className="flex flex-wrap items-center gap-2 mt-2">
<span className="px-2.5 py-0.5 rounded-full bg-[#FFE5D9] text-[#B74747] font-label-sm text-label-sm font-semibold">P: 22g</span>
<span className="px-2.5 py-0.5 rounded-full bg-[#DCEBFA] text-[#2A6EB0] font-label-sm text-label-sm font-semibold">C: 18g</span>
<span className="px-2.5 py-0.5 rounded-full bg-[#FEF3D6] text-[#8D6800] font-label-sm text-label-sm font-semibold">F: 9g</span>
</div>
</div>
</div>
<div className="flex items-center gap-4 self-end md:self-center">
<span className="font-title-lg text-title-lg font-bold text-on-surface">260 <span className="font-label-sm text-label-sm font-normal text-outline">kcal</span></span>
<button className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline transition-colors"><span className="material-symbols-outlined text-[18px]">more_vert</span></button>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="w-full py-space-xl lg:py-24 bg-surface-container-low">
<div className="max-w-[1320px] mx-auto px-gutter-mobile lg:px-margin">

<div className="text-center max-w-2xl mx-auto mb-space-xl">
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest bg-secondary-container/70 px-3 py-1 rounded-full">Long-term Habits</span>
<h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mt-3 tracking-tight">See your habits over time.</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-2">Build a rhythm of balanced nourishment. Track consistency without punishment or guilt.</p>
</div>

<div className="max-w-4xl mx-auto bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgba(33,23,44,0.04)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

<div className="lg:col-span-7">

<div className="flex items-center justify-between mb-6">
<h3 className="font-title-lg text-title-lg font-bold text-on-surface">October 2024</h3>
<div className="flex items-center gap-1">
<button className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
<button className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
</div>
</div>

<div className="grid grid-cols-7 text-center mb-3">
<span className="font-label-sm text-label-sm text-outline font-semibold">M</span>
<span className="font-label-sm text-label-sm text-outline font-semibold">T</span>
<span className="font-label-sm text-label-sm text-outline font-semibold">W</span>
<span className="font-label-sm text-label-sm text-outline font-semibold">T</span>
<span className="font-label-sm text-label-sm text-outline font-semibold">F</span>
<span className="font-label-sm text-label-sm text-outline font-semibold">S</span>
<span className="font-label-sm text-label-sm text-outline font-semibold">S</span>
</div>

<div className="grid grid-cols-7 gap-2">

<div className="h-11 rounded-2xl flex flex-col items-center justify-center text-outline-variant font-label-md text-label-md">29</div>
<div className="h-11 rounded-2xl flex flex-col items-center justify-center text-outline-variant font-label-md text-label-md">30</div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">1</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">2</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">3</span><span className="w-1.5 h-1.5 rounded-full bg-primary absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">4</span><span className="w-1.5 h-1.5 rounded-full bg-[#B74747] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">5</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">6</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">7</span><span className="w-1.5 h-1.5 rounded-full bg-primary absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">8</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">9</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">10</span><span className="w-1.5 h-1.5 rounded-full bg-primary absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">11</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">12</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">13</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">14</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">15</span><span className="w-1.5 h-1.5 rounded-full bg-primary absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">16</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">17</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">18</span><span className="w-1.5 h-1.5 rounded-full bg-[#B74747] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">19</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">20</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">21</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">22</span><span className="w-1.5 h-1.5 rounded-full bg-primary absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">23</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>

<div className="h-11 rounded-2xl bg-primary text-on-primary flex flex-col items-center justify-center relative shadow-md scale-105 font-bold">
<span className="font-label-md text-label-md">24</span>
<span className="w-1.5 h-1.5 rounded-full bg-on-primary absolute bottom-1"></span>
</div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">25</span><span className="w-1.5 h-1.5 rounded-full bg-[#3B7A3E] absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">26</span><span className="w-1.5 h-1.5 rounded-full bg-primary absolute bottom-1"></span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">27</span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">28</span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">29</span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">30</span></div>
<div className="h-11 rounded-2xl bg-surface-container-low flex flex-col items-center justify-center relative"><span className="font-label-md text-label-md text-on-surface">31</span></div>
<div className="h-11 rounded-2xl flex flex-col items-center justify-center text-outline-variant font-label-md text-label-md">1</div>
<div className="h-11 rounded-2xl flex flex-col items-center justify-center text-outline-variant font-label-md text-label-md">2</div>
</div>

<div className="flex items-center gap-4 mt-6 pt-4 border-t border-surface-container font-label-sm text-label-sm text-on-surface-variant">
<div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3B7A3E]"></span><span>On Target</span></div>
<div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary"></span><span>Maintenance</span></div>
<div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#B74747]"></span><span>Rest Day</span></div>
</div>
</div>

<div className="lg:col-span-5 bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between h-full">
<div>
<div className="flex items-center justify-between mb-4">
<div>
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">Day Inspector</span>
<h4 className="font-title-lg text-title-lg font-bold text-on-surface mt-0.5">Wednesday, Oct 24</h4>
</div>
<span className="px-2.5 py-1 rounded-full bg-[#E2F0D9] text-[#3B7A3E] font-label-sm text-label-sm font-semibold">98% Goal Met</span>
</div>
<div className="space-y-4 my-6">
<div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm">
<div className="flex items-center justify-between text-body-sm">
<span className="text-on-surface-variant">Calorie Intake</span>
<span className="font-bold text-on-surface">2,050 <span className="font-normal text-outline">/ 2,100 kcal</span></span>
</div>
<div className="w-full h-1.5 rounded-full bg-surface-container mt-2 overflow-hidden">
<div className="h-full bg-primary rounded-full w-[98%]"></div>
</div>
</div>
<div className="grid grid-cols-2 gap-3">
<div className="p-3 rounded-xl bg-surface-container-lowest shadow-sm">
<span className="font-label-sm text-label-sm text-outline">Protein Hit</span>
<p className="font-title-md text-title-md font-bold text-on-surface mt-1">138g</p>
</div>
<div className="p-3 rounded-xl bg-surface-container-lowest shadow-sm">
<span className="font-label-sm text-label-sm text-outline">Meals Logged</span>
<p className="font-title-md text-title-md font-bold text-on-surface mt-1">4 Meals</p>
</div>
</div>

<div className="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm">
<span className="font-label-sm text-label-sm text-outline font-medium">Daily Note</span>
<p className="font-body-sm text-body-sm text-on-surface mt-1 italic leading-relaxed">
                  “Hydration target reached. Good energy levels through the afternoon workout.”
                </p>
</div>
</div>
</div>
<button className="w-full py-2.5 rounded-xl bg-secondary-container text-primary font-label-md text-label-md font-semibold hover:bg-secondary-fixed-dim transition-colors">
            Open Full Daily Log
          </button>
</div>
</div>
</div>
</section>

<section className="w-full py-space-xl lg:py-24 bg-surface">
<div className="max-w-[1320px] mx-auto px-gutter-mobile lg:px-margin">

<div className="text-center max-w-2xl mx-auto mb-space-xl">
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest bg-secondary-container/70 px-3 py-1 rounded-full">Nutrition Analytics</span>
<h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mt-3 tracking-tight">Progress you can actually understand.</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-2">Clear visual telemetry that transforms raw food numbers into actionable dietary mastery.</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-4">
<h3 className="font-title-md text-title-md font-bold text-on-surface">Weekly Calorie Trend</h3>
<span className="font-label-sm text-label-sm text-primary font-semibold">Avg: 2,085</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Mon–Sun adherence compared to daily baseline.</p>

<div className="relative w-full h-36 flex items-end justify-between px-2 pt-6">

<div className="absolute top-10 left-0 right-0 border-b border-dashed border-primary/30 flex justify-end">
<span className="font-label-sm text-[10px] text-primary/70 -mt-4 pr-1">Target: 2,100</span>
</div>

<div className="flex flex-col items-center gap-1.5 z-10">
<div className="w-6 rounded-t-lg bg-secondary-container h-24 hover:bg-primary transition-colors"></div>
<span className="font-label-sm text-label-sm text-outline">M</span>
</div>
<div className="flex flex-col items-center gap-1.5 z-10">
<div className="w-6 rounded-t-lg bg-secondary-container h-28 hover:bg-primary transition-colors"></div>
<span className="font-label-sm text-label-sm text-outline">T</span>
</div>
<div className="flex flex-col items-center gap-1.5 z-10">
<div className="w-6 rounded-t-lg bg-primary h-26 hover:bg-primary-container transition-colors"></div>
<span className="font-label-sm text-label-sm font-bold text-primary">W</span>
</div>
<div className="flex flex-col items-center gap-1.5 z-10">
<div className="w-6 rounded-t-lg bg-secondary-container h-20 hover:bg-primary transition-colors"></div>
<span className="font-label-sm text-label-sm text-outline">T</span>
</div>
<div className="flex flex-col items-center gap-1.5 z-10">
<div className="w-6 rounded-t-lg bg-secondary-container h-25 hover:bg-primary transition-colors"></div>
<span className="font-label-sm text-label-sm text-outline">F</span>
</div>
<div className="flex flex-col items-center gap-1.5 z-10">
<div className="w-6 rounded-t-lg bg-secondary-container h-27 hover:bg-primary transition-colors"></div>
<span className="font-label-sm text-label-sm text-outline">S</span>
</div>
<div className="flex flex-col items-center gap-1.5 z-10">
<div className="w-6 rounded-t-lg bg-secondary-container h-22 hover:bg-primary transition-colors"></div>
<span className="font-label-sm text-label-sm text-outline">S</span>
</div>
</div>
</div>
<div className="mt-6 pt-4 border-t border-surface-container flex items-center justify-between text-body-sm text-on-surface-variant">
<span>Variance</span>
<span className="text-[#3B7A3E] font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">check_circle</span> ±1.5% from Target
            </span>
</div>
</div>

<div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-4">
<h3 className="font-title-md text-title-md font-bold text-on-surface">Weight Trajectory</h3>
<span className="font-label-sm text-label-sm text-[#3B7A3E] font-semibold">-1.4 lbs / wk</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Smoothed 7-day rolling average eliminates daily water noise.</p>

<div className="w-full h-36 flex items-center justify-center">
<svg className="w-full h-full" fill="none" viewBox="0 0 240 100">

<defs>
<linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#7e57c2" stopOpacity="0.15"></stop>
<stop offset="100%" stopColor="#7e57c2" stopOpacity="0.0"></stop>
</linearGradient>
</defs>
<path d="M 0 40 Q 60 45, 120 58 T 240 75 L 240 100 L 0 100 Z" fill="url(#chartGradient)" />
<path d="M 0 40 Q 60 45, 120 58 T 240 75" fill="none" stroke="#653da7" strokeLinecap="round" strokeWidth="3" />
<circle cx="0" cy="40" fill="#653da7" r="4" />
<circle cx="120" cy="58" fill="#653da7" r="4" />
<circle className="animate-ping" cx="240" cy="75" fill="#653da7" r="5" />
<circle cx="240" cy="75" fill="#ffffff" r="4" stroke="#653da7" strokeWidth="2" />
</svg>
</div>
</div>
<div className="mt-6 pt-4 border-t border-surface-container flex items-center justify-between text-body-sm text-on-surface-variant">
<span>Current Rolling Avg</span>
<span className="font-bold text-on-surface">143.6 lbs</span>
</div>
</div>

<div className="bg-surface-container-lowest p-6 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-4">
<h3 className="font-title-md text-title-md font-bold text-on-surface">Consistency Score</h3>
<span className="w-2.5 h-2.5 rounded-full bg-[#3B7A3E]"></span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Key behavioral indicators over the past 30 days.</p>
<div className="space-y-4">
<div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between">
<span className="font-body-sm text-body-sm text-on-surface-variant">Goal Consistency</span>
<span className="font-title-md text-title-md font-bold text-primary">92%</span>
</div>
<div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between">
<span className="font-body-sm text-body-sm text-on-surface-variant">Avg Daily Calories</span>
<span className="font-title-md text-title-md font-bold text-on-surface">2,085 kcal</span>
</div>
<div className="p-3.5 rounded-2xl bg-surface-container-low flex items-center justify-between">
<span className="font-body-sm text-body-sm text-on-surface-variant">Macro Adherence</span>
<span className="px-2.5 py-0.5 rounded-full bg-[#E2F0D9] text-[#3B7A3E] font-label-sm text-label-sm font-bold">High (94%)</span>
</div>
</div>
</div>
<div className="mt-6 pt-4 border-t border-surface-container flex items-center justify-between text-body-sm text-on-surface-variant">
<span>Logged Days</span>
<span className="font-bold text-on-surface">28 / 30 Days</span>
</div>
</div>
</div>
</div>
</section>

<section className="w-full py-space-xl lg:py-24 bg-surface-container-low">
<div className="max-w-[1320px] mx-auto px-gutter-mobile lg:px-margin">

<div className="text-center max-w-2xl mx-auto mb-space-xl">
<span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-widest bg-secondary-container/70 px-3 py-1 rounded-full">The CalorieMate Method</span>
<h2 className="font-headline-lg text-headline-lg-mobile lg:text-headline-lg text-on-surface mt-3 tracking-tight">Three steps to lasting nutritional clarity.</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-2">A sustainable sequence designed to eliminate obsessive tracking and encourage mindful nourishment.</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

<div className="relative bg-surface-container-lowest p-8 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
<div>
<span className="font-display-hero text-[42px] font-extrabold text-secondary-container tracking-tight block mb-4 group-hover:text-primary transition-colors">01</span>
<h3 className="font-title-lg text-title-lg font-bold text-on-surface mb-3">Calculate</h3>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Find your personalized calorie and macronutrient baseline grounded in physiological science, tailored to your metabolic rate and true lifestyle.
            </p>
</div>
<div className="mt-8 flex items-center gap-2 text-primary font-label-md text-label-md font-semibold">
<span>Science-based baseline</span>
<span className="material-symbols-outlined text-[16px]">check</span>
</div>
</div>

<div className="relative bg-surface-container-lowest p-8 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
<div>
<span className="font-display-hero text-[42px] font-extrabold text-secondary-container tracking-tight block mb-4 group-hover:text-primary transition-colors">02</span>
<h3 className="font-title-lg text-title-lg font-bold text-on-surface mb-3">Track</h3>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Log meals across breakfast, lunch, and dinner in seconds with zero clutter. Focus on wholesome eating without tedious micro-logging friction.
            </p>
</div>
<div className="mt-8 flex items-center gap-2 text-primary font-label-md text-label-md font-semibold">
<span>Effortless meal entries</span>
<span className="material-symbols-outlined text-[16px]">check</span>
</div>
</div>

<div className="relative bg-surface-container-lowest p-8 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
<div>
<span className="font-display-hero text-[42px] font-extrabold text-secondary-container tracking-tight block mb-4 group-hover:text-primary transition-colors">03</span>
<h3 className="font-title-lg text-title-lg font-bold text-on-surface mb-3">Improve</h3>
<p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              Understand your trends, adapt smoothly to your body's natural responses, and build effortless lifelong consistency that stays with you.
            </p>
</div>
<div className="mt-8 flex items-center gap-2 text-primary font-label-md text-label-md font-semibold">
<span>Lifelong dietary clarity</span>
<span className="material-symbols-outlined text-[16px]">check</span>
</div>
</div>
</div>
</div>
</section>

<section className="w-full py-space-xl lg:py-28 bg-surface">
<div className="max-w-[1320px] mx-auto px-gutter-mobile lg:px-margin">

<div className="relative w-full rounded-[2.5rem] bg-gradient-to-br from-secondary-container/50 via-primary-fixed/25 to-surface-container-lowest p-8 sm:p-16 lg:p-20 text-center shadow-[0_16px_40px_rgba(101,61,167,0.06)] overflow-hidden">

<div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
<div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-secondary-container/80 blur-3xl pointer-events-none"></div>
<div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">

<div className="w-12 h-12 rounded-2xl bg-surface-container-lowest shadow-sm flex items-center justify-center text-primary mb-6">
<span className="material-symbols-outlined text-[26px]">spa</span>
</div>

<h2 className="font-display-hero text-headline-lg-mobile sm:text-headline-lg lg:text-display-hero text-on-surface font-bold tracking-tight">
            Start understanding your nutrition today.
          </h2>

<p className="font-body-lg text-body-lg text-on-surface-variant mt-4 max-w-xl leading-relaxed">
            Calculate your needs, track your meals, and build better consistency with a calm, modern tracker built for humans.
          </p>

<div className="mt-8">
<Link className="h-13 px-8 py-3.5 rounded-full bg-primary text-on-primary font-title-md text-title-md inline-flex items-center gap-2.5 shadow-[0_8px_20px_rgba(101,61,167,0.28)] hover:bg-primary-container transition-all hover:scale-105 active:scale-95" to="/signup">
<span>Get Started</span>
<span className="material-symbols-outlined text-[20px]">arrow_forward</span>
</Link>
</div>

<p className="font-label-sm text-label-sm text-outline mt-4">
            No credit card required. Free tier available forever.
          </p>
</div>
</div>
</div>
</section>
</div></main>
    </div>
  );
};

export default LandingPage;
