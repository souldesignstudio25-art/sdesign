export interface DetailedService {
  slug: string
  title: string
  shortTitle: string
  kicker: string
  seoTitle: string
  seoDescription: string
  leadParagraph: string
  fullOverview: string
  disciplines: string[]
  processPhases: {
    number: string
    name: string
    description: string
  }[]
  deliverables: string[]
  materialityFocus: string
  sustainableAspects: string
  featuredProjectSlugs: string[]
  faqs: {
    question: string
    answer: string
  }[]
}

export const ARCHITECTURAL_SERVICES: DetailedService[] = [
  {
    slug: 'residential-architecture',
    title: 'Residential Architecture & Private Villa Design',
    shortTitle: 'Residential Architecture',
    kicker: 'SERVICE DISCIPLINE ( 01 )',
    seoTitle: ' DESIGNS',
    seoDescription:
      'Sylen Designs is a modern residential architecture firm designing luxury villas, custom private residences, and minimalist homes. Contextual, climate-responsive, and enduring.',
    leadParagraph:
      'We design private residences and luxury villas shaped around the daily rituals of living—orchestrating natural light, tactile materiality, and spatial stillness.',
    fullOverview:
      'Our residential architectural practice approaches every home as a bespoke sanctuary. Rather than imposing predetermined styles, we study the solar paths, prevailing breezes, topography, and surrounding native landscapes of the site. Whether creating an expansive hillside villa or an intimate courtyard retreat, our methodology balances monolithic structural mass with delicate glass apertures to foster deep connections between inhabitants and their environment.',
    disciplines: [
      'Luxury Villa Architecture',
      'Custom Single-Family Residences',
      'Modern Farmhouses & Pavilions',
      'Coastal & Hillside Dwellings',
      'Passive Solar Home Design',
      'Private Estate Master Planning',
    ],
    processPhases: [
      {
        number: '01',
        name: 'Site Feasibility & Solar Geometry',
        description:
          'Deep investigation of local topography, orientation, zoning regulations, daylight trajectories, and contextual environmental factors.',
      },
      {
        number: '02',
        name: 'Concept & Volumetric Massing',
        description:
          'Developing architectural concept models, spatial proportions, volumetric studies, and initial site flow diagrams.',
      },
      {
        number: '03',
        name: 'Design Development & Spatial Planning',
        description:
          'Refining structural frames, indoor-outdoor relationships, facade rhythms, and high-performance building envelope details.',
      },
      {
        number: '04',
        name: 'Technical Construction Documentation',
        description:
          'Comprehensive architectural working drawings, bespoke assembly details, MEP coordination, and material specifications.',
      },
      {
        number: '05',
        name: 'On-Site Construction Observation',
        description:
          'Regular site inspections, craftsperson alignment, and meticulous review to ensure precision execution from foundation to handover.',
      },
    ],
    deliverables: [
      'Comprehensive architectural drawing sets (plans, elevations, sections, details)',
      '3D daylight simulations and volumetric architectural visualization',
      'High-performance building envelope specifications',
      'Custom window and door fenestration schedules',
      'Regulatory compliance and building permit documentation sets',
    ],
    materialityFocus:
      'Honed natural limestone, board-formed architectural concrete, thermal-treated timber, and patinated bronze fixtures selected for tactile aging.',
    sustainableAspects:
      'Passive solar heating, cross-ventilation corridors, deep overhangs for thermal shading, high thermal mass, and rainwater conservation.',
    featuredProjectSlugs: ['casa-loma', 'house-for-silence', 'the-mineral-house'],
    faqs: [
      {
        question: 'What distinguishes a specialized residential architecture firm from a general contractor?',
        answer:
          'A specialized residential architecture firm designs custom, site-specific structures tailored to your lifestyle, climate, and topography. We craft cohesive architectural identities, oversee structural engineering, specify premium durable materials, and represent your vision during construction observation.',
      },
      {
        question: 'How do you incorporate passive climate design into modern residential architecture?',
        answer:
          'We position living spaces to maximize natural daylight without heat gain, design strategic window placements for cross-ventilation, incorporate thermal mass materials like stone and concrete, and engineer deep roof cantilevers for seasonal sun control.',
      },
      {
        question: 'What is the typical timeline for an architectural villa design?',
        answer:
          'Comprehensive residential architectural commissions typically take 3 to 6 months for schematic design through permit-ready technical documentation, followed by site execution depending on project scale and complexity.',
      },
    ],
  },
  {
    slug: 'interior-architecture',
    title: 'Interior Architecture & Spatial Curation',
    shortTitle: 'Interior Architecture',
    kicker: 'SERVICE DISCIPLINE ( 02 )',
    seoTitle: ' DESIGNS',
    seoDescription:
      'Bespoke interior architecture firm specializing in spatial curation, custom millwork, tactile materials, and integrated architectural lighting design.',
    leadParagraph:
      'Interior architecture is the thoughtful crafting of internal space—choreographing flow, proportions, acoustic warmth, and bespoke joinery with quiet precision.',
    fullOverview:
      'At Sylen Designs, interior architecture is inseparable from the external building shell. We sculpt interior volumes with honest materials—hand-applied limewash, warm oak, honed travertine, and raw linen. Every spatial threshold, sightline, and lighting fixture is calibrated to produce a calming atmosphere devoid of superfluous visual noise. Our studio designs bespoke built-in cabinetry, integrated seating, and curated transitions that feel intrinsic to the building’s structural bones.',
    disciplines: [
      'Bespoke Joinery & Millwork Design',
      'Spatial Flow & Layout Optimization',
      'Architectural Lighting Choreography',
      'Tactile Material & Stone Specification',
      'Acoustic Comfort & Spatial Tuning',
      'Kitchen & Bath Architecture',
    ],
    processPhases: [
      {
        number: '01',
        name: 'Spatial Anatomy & Flow Analysis',
        description:
          'Mapping daily movement patterns, sightlines, natural daylight ingress, and functional lifestyle zones.',
      },
      {
        number: '02',
        name: 'Materiality & Mood Curation',
        description:
          'Tactile physical sample boards featuring hand-selected timbers, natural stones, lime plasters, and architectural metals.',
      },
      {
        number: '03',
        name: 'Custom Joinery Detailing',
        description:
          'Meticulous 1:10 and 1:5 scale drawings for custom cabinets, hidden pocket doors, recessed baseboards, and built-ins.',
      },
      {
        number: '04',
        name: 'Lighting Design & Integration',
        description:
          'Concealed indirect illumination plans, architectural cove details, and warm Kelvin fixture schedules.',
      },
      {
        number: '05',
        name: 'Finishing & On-Site Alignment',
        description:
          'Close coordination with master carpenters, stone masons, and finishes artisans throughout installation.',
      },
    ],
    deliverables: [
      'Detailed internal elevation and section packages',
      'Custom millwork, joinery, and cabinetry construction sets',
      'Comprehensive material finish schedules and physical sample palettes',
      'Architectural lighting layout and switching schematics',
      'Plumbing fixture, hardware, and equipment schedules',
    ],
    materialityFocus:
      'Fluted Roman travertine, quartersawn European oak, breathable lime plaster, blackened steel, and natural woven textiles.',
    sustainableAspects:
      'Zero-VOC natural mineral finishes, sustainably harvested FSC-certified timbers, long-lifecycle solid stone, and energy-efficient LED optics.',
    featuredProjectSlugs: ['the-mineral-house', 'dune-atelier', 'casa-loma'],
    faqs: [
      {
        question: 'What is the difference between interior design and interior architecture?',
        answer:
          'Interior design often focuses on furnishings, fabrics, and decorative accents. Interior architecture alters and shapes the physical structure of indoor space—including wall layouts, door openings, ceilings, built-in millwork, material finishes, and integrated architectural lighting.',
      },
      {
        question: 'Can Sylen Designs handle custom millwork and cabinetry detailing?',
        answer:
          'Yes. Bespoke joinery is central to our work. We produce shop-ready architectural drawings for custom wardrobes, concealed kitchens, bathroom vanities, and integrated wall paneling.',
      },
    ],
  },
  {
    slug: 'exterior-architecture',
    title: 'Exterior Architecture & Building Facade Design',
    shortTitle: 'Exterior Architecture',
    kicker: 'SERVICE DISCIPLINE ( 03 )',
    seoTitle: ' DESIGNS',
    seoDescription:
      'Architectural exterior design, high-performance facade engineering, and modern building elevation design by Sylen Designs architecture studio.',
    leadParagraph:
      'We sculpt enduring building envelopes and facade elevations that balance tectonic presence with climatic responsiveness and timeless materiality.',
    fullOverview:
      'A building’s exterior is its conversation with the world. Sylen Designs conceives facades not as flat decorative surfaces, but as three-dimensional protective skins that modulate weather, frame landscape vistas, and cast ever-shifting shadows across the day. By utilizing enduring exterior materials such as monolithic stone, ventilated terracotta rainscreens, rammed earth, and textured plaster, our building elevations age gracefully while providing optimal thermal insulation and weather protection.',
    disciplines: [
      'Modern House Exterior Design',
      'Architectural Elevation Design',
      'High-Performance Facade Engineering',
      'Ventilated Rainscreen Envelopes',
      'Deep Shading & Brise-Soleil Systems',
      'Exterior Materiality & Texture Studies',
    ],
    processPhases: [
      {
        number: '01',
        name: 'Climatic & Solar Exposure Modeling',
        description:
          'Evaluating wind loads, rain exposure, UV radiation, and seasonal sun angles across all elevations.',
      },
      {
        number: '02',
        name: 'Proportional Elevation Studies',
        description:
          'Balancing solid-to-void ratios, window rhythms, vertical massing, and horizontal datum lines.',
      },
      {
        number: '03',
        name: 'Envelope Engineering & Thermal Breaks',
        description:
          'Detailing insulation continuity, vapor barriers, flashing membranes, and thermal bridging prevention.',
      },
      {
        number: '04',
        name: 'Exterior Mockups & Finish Validation',
        description:
          'Reviewing physical 1:1 on-site material mockups for mortar color, stone dressing, plaster texture, and metal anodization.',
      },
    ],
    deliverables: [
      'Scale elevation drawings for all facade orientations',
      'Building envelope detail sheets (head, jamb, sill, parapet, foundation interfaces)',
      'Solar shading and architectural louvre fabrication packages',
      'Exterior lighting and facade illumination schematics',
      'Comprehensive exterior finish specifications and durability warranties',
    ],
    materialityFocus:
      'Honed basalt, monolithic travertine panels, lime render, weathering steel, and low-iron architectural glass.',
    sustainableAspects:
      'Continuous exterior insulation, airtight envelope construction, solar control glazing, and breathable lime renders preventing moisture entrapment.',
    featuredProjectSlugs: ['the-mineral-house', 'pavilion-of-light', 'casa-loma'],
    faqs: [
      {
        question: 'Why is facade design critical to building energy efficiency?',
        answer:
          'The building envelope accounts for the vast majority of heating and cooling energy loss. A properly engineered exterior facade with continuous thermal insulation and solar shading dramatically reduces energy demands while ensuring comfortable indoor temperatures year-round.',
      },
      {
        question: 'Do you design exterior facades for both new construction and existing building renovations?',
        answer:
          'Yes. We design new ground-up building envelopes as well as modern facade recladding and restoration projects for existing residences and commercial properties.',
      },
    ],
  },
  {
    slug: 'landscape-architecture',
    title: 'Landscape Architecture & Spatial Integration',
    shortTitle: 'Landscape Architecture',
    kicker: 'SERVICE DISCIPLINE ( 04 )',
    seoTitle: ' DESIGNS',
    seoDescription:
      'Context-sensitive landscape architecture, courtyard design, reflection pools, and outdoor living environments integrated seamlessly with built structures.',
    leadParagraph:
      'Landscape architecture at Sylen Designs dissolves the boundary between interior sanctuaries and the natural world, crafting outdoor rooms of enduring beauty.',
    fullOverview:
      'We believe architecture and landscape must be conceived as a single uninterrupted continuum. Our landscape architecture practice designs contemplative internal courtyards, stone garden terraces, reflection pools, and native botanical compositions that respond to the land’s natural contours. By prioritizing water conservation, soil health, and microclimate moderation, our outdoor environments enrich biodiversity while offering quiet retreats for open-air living.',
    disciplines: [
      'Residential Landscape Architecture',
      'Courtyard Architecture & Atriums',
      'Water Features & Reflection Pools',
      'Hardscape Terraces & Stone Paving',
      'Native & Climate-Resilient Planting',
      'Outdoor Dining & Fireplace Environments',
    ],
    processPhases: [
      {
        number: '01',
        name: 'Ecological & Topographic Assessment',
        description:
          'Analyzing existing tree canopies, soil composition, watershed trajectories, and indigenous botanical communities.',
      },
      {
        number: '02',
        name: 'Indoor-Outdoor Spatial Connectivity',
        description:
          'Aligning floor levels, threshold transitions, framed garden axes, and outdoor living terraces with internal living spaces.',
      },
      {
        number: '03',
        name: 'Hardscape Geometry & Material Detailing',
        description:
          'Engineering stone paving patterns, low retaining walls, steps, coping edges, and sunken courtyards.',
      },
      {
        number: '04',
        name: 'Botanical Curation & Microclimate Planting',
        description:
          'Selecting layered drought-tolerant flora, scent gardens, and shade trees that evolve gracefully across seasons.',
      },
    ],
    deliverables: [
      'Landscape master plan and hardscape construction drawings',
      'Grading, drainage, and stormwater management layouts',
      'Planting schedules with botanical nomenclature and growth heights',
      'Garden lighting, pathway illumination, and reflection pool detailing',
      'Irrigation and water-efficiency maintenance guidelines',
    ],
    materialityFocus:
      'Local dry-stack stone, decomposed granite paths, weathered teak decking, and dark basalt water basins.',
    sustainableAspects:
      'Permeable hardscapes recharging groundwater, native xeriscaping minimizing irrigation needs, and biodiversity enhancement.',
    featuredProjectSlugs: ['pavilion-of-light', 'casa-loma', 'onyx-villa'],
    faqs: [
      {
        question: 'How does Sylen Designs integrate landscape architecture with the house design?',
        answer:
          'We plan both simultaneously. Indoor floor finishes extend directly onto exterior terraces, interior sightlines terminate at carefully positioned specimen trees or water elements, and courtyard spaces bring natural light and vegetation into the core of the home.',
      },
      {
        question: 'Do you work with native and low-water plants?',
        answer:
          'Yes. We prioritize native, climate-resilient botanical palettes that require minimal irrigation, adapt naturally to regional soils, and provide habitat for local pollinators.',
      },
    ],
  },
  {
    slug: 'commercial-architecture',
    title: 'Commercial & Hospitality Architecture',
    shortTitle: 'Commercial & Hospitality',
    kicker: 'SERVICE DISCIPLINE ( 05 )',
    seoTitle: ' DESIGNS',
    seoDescription:
      'Contemporary commercial architecture firm creating boutique hospitality estates, creative work studios, and contemplative commercial environments.',
    leadParagraph:
      'We design commercial and hospitality environments that communicate brand distinction through spatial authenticity, material honesty, and human-scaled intimacy.',
    fullOverview:
      'In a world of generic commercial spaces, Sylen Designs creates destinations that leave an indelible impression. From boutique hillside guest retreats to creative studio ateliers and curated retail galleries, our commercial work balances memorable visitor journeys with rigorous operational efficiency. We craft environments that foster collaboration, focused contemplation, and emotional resonance—elevating everyday commercial exchanges into unforgettable spatial moments.',
    disciplines: [
      'Boutique Hospitality & Villa Retreats',
      'Creative Workspaces & Design Ateliers',
      'Art Galleries & Cultural Pavilions',
      'Concept Retail & Tasting Rooms',
      'Adaptive Commercial Conversions',
      'Master Planning for Boutique Resorts',
    ],
    processPhases: [
      {
        number: '01',
        name: 'Brand Vision & Operational Programming',
        description:
          'Understanding business workflows, guest touchpoints, acoustic requirements, back-of-house logistics, and customer flow.',
      },
      {
        number: '02',
        name: 'Atmospheric Spatial Concept',
        description:
          'Developing immersive spatial narratives, volumetric zones, and focal gathering spaces that embody your brand identity.',
      },
      {
        number: '03',
        name: 'Comprehensive Code & Accessibility Integration',
        description:
          'Seamlessly incorporating accessibility, fire egress, acoustic attenuation, and commercial building code requirements.',
      },
      {
        number: '04',
        name: 'Execution & Custom Fixture Coordination',
        description:
          'Overseeing commercial contractor bidding, custom display fabrication, and turnkey architectural delivery.',
      },
    ],
    deliverables: [
      'Commercial architectural drawings with code compliance certifications',
      'Occupancy calculations, egress routes, and accessibility plans',
      'Custom reception, bar, and display fixture fabrication packages',
      'Acoustic attenuation and integrated commercial MEP coordination sets',
      'Material durability schedules tailored for heavy foot-traffic hospitality use',
    ],
    materialityFocus:
      'High-traffic honed terrazzo, wire-brushed ash, architectural acoustic felt, micro-cement, and solid brass accents.',
    sustainableAspects:
      'Energy-efficient zone HVAC controls, daylight harvesting sensors, high-durability low-maintenance surfaces, and waste-reduction construction protocols.',
    featuredProjectSlugs: ['onyx-villa', 'dune-atelier', 'pavilion-of-light'],
    faqs: [
      {
        question: 'What types of commercial projects does Sylen Designs undertake?',
        answer:
          'We specialize in boutique hospitality estates, executive design ateliers, high-end commercial showrooms, art galleries, and bespoke office environments where architectural atmosphere is essential.',
      },
      {
        question: 'How do you balance aesthetic luxury with commercial durability?',
        answer:
          'We specify commercial-grade natural materials—such as monolithic terrazzo, solid stone, and oil-finished hardwoods—that patinate beautifully over time rather than wearing out, paired with easy-to-maintain protective finishes.',
      },
    ],
  },
  {
    slug: 'renovation-adaptive-reuse',
    title: 'Renovation, Restoration & Adaptive Reuse',
    shortTitle: 'Renovation & Reuse',
    kicker: 'SERVICE DISCIPLINE ( 06 )',
    seoTitle: ' DESIGNS',
    seoDescription:
      'Specialized architectural renovation, historic building restoration, and adaptive reuse architecture. Preserving heritage while introducing modern comfort.',
    leadParagraph:
      'We breathe new vitality into historic and existing structures—honoring original architectural character while introducing modern daylight and spatial flow.',
    fullOverview:
      'Renovation and adaptive reuse are among the most sustainable acts an architecture studio can perform. Rather than demolishing, Sylen Designs uncovers the latent poetry within existing masonry, historic timber trusses, and heritage stone vaults. We surgically remove awkward later additions, introduce double-height light wells, stabilize historic envelopes, and integrate discreet modern infrastructure, creating a timeless dialogue between the historic and the contemporary.',
    disciplines: [
      'Historic Villa & Estate Restoration',
      'Adaptive Reuse of Heritage Structures',
      'Structural Strengthening & Underpinning',
      'Interior Spatial Reconfiguration',
      'Energy & Thermal Performance Upgrades',
      'Heritage Agency & Permit Coordination',
    ],
    processPhases: [
      {
        number: '01',
        name: 'Heritage Archival & Forensic Investigation',
        description:
          'Laser scanning, structural soundness evaluation, historic masonry moisture testing, and archival research.',
      },
      {
        number: '02',
        name: 'Intervention Strategy & Concept',
        description:
          'Determining what to preserve, what to expose, and where to introduce contemporary architectural interventions.',
      },
      {
        number: '03',
        name: 'Surgical Structural Engineering',
        description:
          'Engineering concealed steel moment frames, reinforcing ancient foundations, and inserting modern thermal insulation.',
      },
      {
        number: '04',
        name: 'Specialist Artisan Coordination',
        description:
          'Partnering with lime plaster masters, historic stonemasons, and restoration carpenters for authentic conservation.',
      },
    ],
    deliverables: [
      'As-built measured survey sets and condition assessment reports',
      'Demolition, retention, and structural intervention drawings',
      'Conservation authority submission and historical approvals documentation',
      'Thermal upgrade details (internal insulation, heritage double glazing)',
      'Restoration material specifications matching historic binders and mortars',
    ],
    materialityFocus:
      'Breathable hydraulic lime mortar, reclaimed terracotta tiles, historic load-bearing stone, and slim-profile steel windows.',
    sustainableAspects:
      'Maximum conservation of embodied carbon, thermal envelope modernization, and non-toxic historic building materials.',
    featuredProjectSlugs: ['house-for-silence', 'the-mineral-house', 'casa-loma'],
    faqs: [
      {
        question: 'Why choose adaptive reuse over tearing down and building new?',
        answer:
          'Adaptive reuse preserves the irreplaceable historic character, patina, and craftsmanship of the original structure while preventing tons of embodied carbon from entering the atmosphere. It often results in far richer, more soulful spaces than ground-up new builds.',
      },
      {
        question: 'Can modern energy efficiency standards be achieved in an old stone or masonry home?',
        answer:
          'Yes. Through breathable internal insulation systems (such as cork or mineral wool with lime render), high-performance slimline double-glazed windows, and sub-floor hydronic heating, we bring historic residences to contemporary luxury comfort levels without damaging historic walls.',
      },
    ],
  },
]

export function getServiceBySlug(slug: string): DetailedService | undefined {
  return ARCHITECTURAL_SERVICES.find((s) => s.slug === slug)
}

export function getAllServices(): DetailedService[] {
  return ARCHITECTURAL_SERVICES
}
