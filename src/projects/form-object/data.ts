export interface FoProject {
  name: string
  what: string
  tags: string
  year: string
  photo: string
  alt: string
}

export const projects: FoProject[] = [
  { name: 'Kiln', what: 'Identity for a ceramics house', tags: 'Identity · Packaging', year: '2025', photo: '1578749556568-bc2c40e68b61', alt: 'Stacks of glazed ceramic plates and bowls on weathered wood' },
  { name: 'Sound Matter', what: 'Launch campaign for headphones', tags: 'Campaign · 3D', year: '2025', photo: '1505740420928-5e560c06d30e', alt: 'Black headphones against a saturated yellow backdrop' },
  { name: 'Sit Still', what: 'Furniture exhibition, Milan', tags: 'Spatial · Exhibition', year: '2024', photo: '1567016432779-094069958ea5', alt: 'Burnt-orange sofa with a pink cushion against a green wall' },
  { name: 'Court', what: 'Sportswear capsule', tags: 'Campaign · Digital', year: '2024', photo: '1515886657613-9f3515b0c78f', alt: 'Model in a yellow tracksuit beside a basketball hoop in the desert' },
  { name: 'Verde', what: 'Reusable bottle brand', tags: 'Identity · Product', year: '2023', photo: '1602143407151-7111542de6e8', alt: 'Matte green steel bottle on a white surface' },
  { name: 'Fluid Archive', what: 'Platform for digital art', tags: 'Digital · Web', year: '2023', photo: '1604871000636-074fa5117945', alt: 'Swirling acrylic paint in blue, coral and black' },
]

export const services = [
  { title: 'Identity', items: ['Brand strategy', 'Naming', 'Logo & type systems', 'Packaging', 'Guidelines'] },
  { title: 'Spatial', items: ['Exhibitions', 'Retail interiors', 'Pop-ups', 'Signage', 'Set design'] },
  { title: 'Digital', items: ['Websites', 'Campaign sites', 'Motion', '3D & CGI', 'Social systems'] },
  { title: 'Objects', items: ['Product design', 'Limited editions', 'Merchandise', 'Prototyping', 'Production'] },
]

export const hero = { photo: '1503602642458-232111445657', alt: 'Pale wooden stool against a flat blue wall' }
