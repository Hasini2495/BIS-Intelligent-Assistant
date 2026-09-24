def get_demo_standards():
    return [
        {"id": "std_1", "standard_number": "IS 456", "title": "Plain and Reinforced Concrete", "year": 2000, "status": "Active", "department": "Civil", "committee": "CED 2", "abstract": "Code of practice for plain and reinforced concrete.", "is_demo": True, "keywords": ["concrete", "cement", "construction"]},
        {"id": "std_2", "standard_number": "IS 10500", "title": "Drinking Water Specification", "year": 2012, "status": "Active", "department": "Chemical", "committee": "CHD 1", "abstract": "Specifies the quality of drinking water.", "is_demo": True, "keywords": ["water", "drinking", "purity"]},
        {"id": "std_3", "standard_number": "IS 1893", "title": "Earthquake Resistant Design of Structures", "year": 2016, "status": "Active", "department": "Civil", "committee": "CED 39", "abstract": "Criteria for earthquake resistant design of structures.", "is_demo": True, "keywords": ["earthquake", "seismic", "structures"]},
        {"id": "std_4", "standard_number": "IS 875", "title": "Design Loads for Buildings", "year": 1987, "status": "Active", "department": "Civil", "committee": "CED 37", "abstract": "Code of practice for design loads.", "is_demo": True, "keywords": ["loads", "wind", "snow", "dead loads"]},
        {"id": "std_5", "standard_number": "IS 383", "title": "Coarse and Fine Aggregates", "year": 2016, "status": "Active", "department": "Civil", "committee": "CED 2", "abstract": "Specification for coarse and fine aggregates from natural sources for concrete.", "is_demo": True, "keywords": ["aggregates", "sand", "gravel"]},
        {"id": "std_6", "standard_number": "IS 516", "title": "Method of Tests for Strength of Concrete", "year": 1959, "status": "Active", "department": "Civil", "committee": "CED 2", "abstract": "Methods of tests for strength of concrete.", "is_demo": True, "keywords": ["testing", "compressive strength", "concrete"]},
        {"id": "std_7", "standard_number": "IS 2386", "title": "Methods of Test for Aggregates", "year": 1963, "status": "Active", "department": "Civil", "committee": "CED 2", "abstract": "Methods of test for aggregates for concrete.", "is_demo": True, "keywords": ["aggregates", "testing"]},
        {"id": "std_8", "standard_number": "IS 1786", "title": "High Strength Deformed Steel Bars", "year": 2008, "status": "Active", "department": "Civil", "committee": "CED 54", "abstract": "High strength deformed steel bars and wires for concrete reinforcement.", "is_demo": True, "keywords": ["steel", "rebar", "reinforcement"]},
        {"id": "std_9", "standard_number": "IS 269", "title": "Ordinary Portland Cement", "year": 2015, "status": "Active", "department": "Civil", "committee": "CED 2", "abstract": "Ordinary Portland Cement - Specification.", "is_demo": True, "keywords": ["cement", "opc"]},
        {"id": "std_10", "standard_number": "IS 3025", "title": "Methods of Sampling and Test for Water", "year": 1983, "status": "Active", "department": "Chemical", "committee": "CHD 32", "abstract": "Methods of sampling and test (physical and chemical) for water and wastewater.", "is_demo": True, "keywords": ["water", "wastewater", "testing"]},
        {"id": "std_11", "standard_number": "IS 302", "title": "Safety of Household Electrical Appliances", "year": 2008, "status": "Active", "department": "Electrotechnical", "committee": "ETD 14", "abstract": "Safety of household and similar electrical appliances.", "is_demo": True, "keywords": ["electrical", "safety", "appliances"]},
        {"id": "std_12", "standard_number": "IS 15778", "title": "CPVC Pipes for Potable Water", "year": 2007, "status": "Active", "department": "Civil", "committee": "CED 50", "abstract": "Chlorinated Polyvinyl Chloride (CPVC) pipes for potable hot and cold water distribution supplies.", "is_demo": True, "keywords": ["pipes", "cpvc", "plumbing"]}
    ]

def get_demo_schemes():
    return [
        {"id": "scheme_1", "name": "ISI Mark Certification", "description": "Product certification scheme", "process": [], "docs_required": [], "faqs": []},
        {"id": "scheme_2", "name": "Compulsory Registration Scheme (CRS)", "description": "Electronics and IT goods", "process": [], "docs_required": [], "faqs": []},
        {"id": "scheme_3", "name": "Foreign Manufacturers Certification Scheme (FMCS)", "description": "For foreign manufacturers", "process": [], "docs_required": [], "faqs": []},
        {"id": "scheme_4", "name": "Hallmarking", "description": "Gold and silver jewellery", "process": [], "docs_required": [], "faqs": []}
    ]

def get_demo_labs():
    return [{"id": f"lab_{i}", "name": f"Demo Lab {i}", "location": "Delhi", "accreditation_status": "NABL Accredited", "testing_scope": ["Mechanical"]} for i in range(1, 9)]

def get_demo_services():
    return [{"id": f"srv_{i}", "name": f"Service {i}", "description": f"Demo service {i}"} for i in range(1, 11)]

def get_demo_languages():
    return [
        {"code": "en", "name": "English"}, {"code": "hi", "name": "Hindi"}, {"code": "ta", "name": "Tamil"},
        {"code": "te", "name": "Telugu"}, {"code": "mr", "name": "Marathi"}, {"code": "bn", "name": "Bengali"},
        {"code": "gu", "name": "Gujarati"}, {"code": "kn", "name": "Kannada"}, {"code": "ml", "name": "Malayalam"},
        {"code": "or", "name": "Odia"}, {"code": "pa", "name": "Punjabi"}, {"code": "as", "name": "Assamese"}
    ]
