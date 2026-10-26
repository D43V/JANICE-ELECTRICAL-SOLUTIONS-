-- JA service catalogue additions from the business brief.
-- Prices remain configurable by an administrator; these entries intentionally use custom pricing.
insert into public.services (name, slug, description, category, pricing_type, base_price, unit_name)
values
  ('Single-Line Diagram (SLD) Drafting', 'single-line-diagram-drafting', 'Preparation of clear electrical single-line diagrams for projects and facilities.', 'Design & Consulting', 'custom', 0, 'project'),
  ('Electrical Load Sizing & Analysis', 'electrical-load-sizing-analysis', 'Electrical load calculations and sizing analysis for new or existing installations.', 'Design & Consulting', 'custom', 0, 'project'),
  ('Building Infrastructure Planning', 'building-infrastructure-planning', 'Planning support for building electrical infrastructure and future capacity.', 'Design & Consulting', 'custom', 0, 'project'),
  ('Site Supervision & Quality Control', 'site-supervision-quality-control', 'On-site electrical works supervision and quality control inspections.', 'Consulting', 'custom', 0, 'visit'),
  ('Grid Connection Advisory', 'grid-connection-advisory', 'Practical advisory support for grid connection requirements and coordination.', 'Power & Energy', 'custom', 0, 'project'),
  ('Facility Power Quality Audits', 'facility-power-quality-audits', 'Assessment of facility power quality issues and recommended corrective actions.', 'Power & Energy', 'custom', 0, 'audit'),
  ('Power Factor Correction (PFC)', 'power-factor-correction', 'Power factor assessment and correction planning for improved electrical efficiency.', 'Power & Energy', 'custom', 0, 'project'),
  ('Load Logging & Analysis', 'load-logging-analysis', 'Load logging and analysis to support capacity, reliability and efficiency decisions.', 'Power & Energy', 'custom', 0, 'assessment'),
  ('Thermal Imaging Inspections', 'thermal-imaging-inspections', 'Thermal inspection of electrical equipment to identify abnormal heat and risk areas.', 'Inspection & Maintenance', 'custom', 0, 'inspection'),
  ('Efficiency Upgrade Reporting', 'efficiency-upgrade-reporting', 'Reports identifying practical opportunities to improve electrical efficiency.', 'Power & Energy', 'custom', 0, 'report'),
  ('Turnkey Solar PV Installation', 'turnkey-solar-pv-installation', 'End-to-end solar photovoltaic installation planning and delivery.', 'Solar & Backup', 'custom', 0, 'project'),
  ('Energy Storage Systems', 'energy-storage-systems', 'Battery energy storage solutions designed around site requirements.', 'Solar & Backup', 'custom', 0, 'project'),
  ('Inverter Calibration & MPPT Setup', 'inverter-calibration-mppt-setup', 'Inverter configuration, calibration and MPPT setup for solar systems.', 'Solar & Backup', 'custom', 0, 'system'),
  ('Solar Borehole Pumping Systems', 'solar-borehole-pumping-systems', 'Solar-powered borehole pumping system design and installation.', 'Solar & Backup', 'custom', 0, 'project'),
  ('Automatic Changeover (ATS/AMF)', 'automatic-changeover-ats-amf', 'Automatic transfer and mains failure changeover solutions.', 'Power & Backup', 'custom', 0, 'project'),
  ('Building Electrical Wiring', 'building-electrical-wiring', 'Electrical wiring services for building projects and renovations.', 'Installations', 'custom', 0, 'project'),
  ('Distribution Board (DB) Assemblies', 'distribution-board-assemblies', 'Distribution board assembly, installation and labelling.', 'Installations', 'custom', 0, 'board'),
  ('Power Risers & Cable Trunking', 'power-risers-cable-trunking', 'Power risers, cable trunking and organised cable management installations.', 'Installations', 'custom', 0, 'project'),
  ('Surge Protection Devices (SPD)', 'surge-protection-devices', 'Surge protection device selection and installation for electrical systems.', 'Protection & Safety', 'custom', 0, 'installation'),
  ('Electric Fence Installation', 'electric-fence-installation', 'Electric fence installation and supporting electrical works.', 'Security & Safety', 'custom', 0, 'project'),
  ('Electrical Wiring', 'electrical-wiring', 'General electrical wiring for homes, offices and commercial spaces.', 'Installations', 'custom', 0, 'project')
on conflict (slug) do update set description = excluded.description, category = excluded.category, unit_name = excluded.unit_name, updated_at = now();

-- Contact details are shown in the public contact page and should be moved into
-- the configurable settings table when that table is introduced.


