const fs = require('fs');
const content = `	Architecture Firms
	Real Estate Developers
	Contractors & Builders
	QS Consultancies
	3D Modellers
	Legal & Contract Professionals
	Architecture & Modelling
	Hand Drawn to AutoCAD
Auto Conversion 2D to 3D
WordtoBIM
	WordtoBIM
	WordtoBIM
	Auto Conversion 2D to 3D
	Hand Drawn to AutoCAD 
Auto Conversion 2D to 3D
WordtoBIM
	

	Feasibility
	Planning Law Chatbot
	Planning Law Chatbot
Cost Plan Calculator 
	Planning Law Chatbot
	Cost Plan Calculator 
Prelim
	Prelim
	

	

	

	

	

	

	

	BOQ Preparation
	—
	Quanto for Revit
Quanto for ACC
Quanto for CostX
Quanto for 2D Drawings
CostX to BOQ
Auto Reinforcement Plugin
BuildMarketlk.com


	Quanto for 2D Drawings
CostX to BOQ (sec.)
Auto Reinforcement Plugin
BuildMarketlk.com


	Quanto for Revit
Quanto for ACC
Quanto for CostX
Quanto for 2D Drawings
CostX to BOQ
Auto Reinforcement Plugin
BuildMarketlk.com


	

Auto Reinforcement Plugin


	BuildMarketlk.com


	Tendering
	BuilderBot.ai 


	BuilderBot.ai 




	BuilderBot.ai 
Tender Evaluations
BuildMarketlk.com




	Tender Evaluations
BuildMarketlk.com
Prelim


	

	

	Construction Stage
	BuildMonitor Mobile App


	BuildMonitor Mobile App
MeasureonAir
Auto Reinforcement Plugin


	BuildMonitor Mobile App
MeasureonAir
Auto Reinforcement Plugin


	MeasureonAir
Auto Reinforcement Plugin


	

	BuildMonitor Mobile App


	Claims & Legal Disputes
	BuilderBot.ai 
—
	—


BuilderBot.ai 


	

	BuilderBot.ai 


	—
	BuilderBot.ai
	(sec.) = secondary / supporting role.   Status tags: Scaling, Available, Pre-design, Custom / R&D.`;

const rows = content.split('\n');
console.log(rows.length + " lines");
// Actually, using a script to parse this messy text might not be reliable. I'll just write out the mapping manually in the implementation plan.
