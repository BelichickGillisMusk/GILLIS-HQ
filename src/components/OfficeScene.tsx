import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Department, Agent } from '@/lib/types'

interface OfficeSceneProps {
  departments: Department[]
  agents: Agent[]
  onAgentClick: (agent: Agent) => void
  selectedAgent: Agent | null
}

export function OfficeScene({ departments, agents, onAgentClick, selectedAgent }: OfficeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const agentMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map())

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a14)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 50, 50)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    directionalLight.position.set(10, 20, 10)
    scene.add(directionalLight)

    const floorGeometry = new THREE.PlaneGeometry(100, 100)
    const floorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a2e,
      roughness: 0.8,
      metalness: 0.2
    })
    const floor = new THREE.Mesh(floorGeometry, floorMaterial)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.5
    scene.add(floor)

    const gridHelper = new THREE.GridHelper(100, 50, 0x2a2a3e, 0x1a1a2e)
    gridHelper.position.y = -0.4
    scene.add(gridHelper)

    departments.forEach(dept => {
      const colorMap: Record<string, number> = {
        marketing: 0xf472b6,
        sales: 0x4ade80,
        admin: 0xa78bfa,
        tech: 0x38bdf8,
        operations: 0xfb923c
      }

      const deptGeometry = new THREE.BoxGeometry(dept.size.width, 0.2, dept.size.depth)
      const deptMaterial = new THREE.MeshStandardMaterial({
        color: colorMap[dept.id] || 0x666666,
        transparent: true,
        opacity: 0.3,
        emissive: colorMap[dept.id] || 0x666666,
        emissiveIntensity: 0.2
      })
      const deptMesh = new THREE.Mesh(deptGeometry, deptMaterial)
      deptMesh.position.set(dept.position.x, 0, dept.position.z)
      scene.add(deptMesh)

      const edgesGeometry = new THREE.EdgesGeometry(deptGeometry)
      const edgesMaterial = new THREE.LineBasicMaterial({ color: colorMap[dept.id] || 0x666666, linewidth: 2 })
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial)
      edges.position.copy(deptMesh.position)
      scene.add(edges)
    })

    agents.forEach(agent => {
      const colorMap: Record<string, number> = {
        marketing: 0xf472b6,
        sales: 0x4ade80,
        admin: 0xa78bfa,
        tech: 0x38bdf8,
        operations: 0xfb923c
      }

      const agentGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 8)
      const agentMaterial = new THREE.MeshStandardMaterial({
        color: agent.type === 'Claude' ? 0xffffff : 0xaaaaaa,
        emissive: colorMap[agent.department] || 0x666666,
        emissiveIntensity: agent.status === 'working' ? 0.5 : 0.2,
        metalness: 0.5,
        roughness: 0.3
      })
      const agentMesh = new THREE.Mesh(agentGeometry, agentMaterial)
      agentMesh.position.set(agent.position.x, 1, agent.position.z)
      agentMesh.userData = { agent }
      scene.add(agentMesh)
      agentMeshesRef.current.set(agent.id, agentMesh)

      if (agent.status === 'working') {
        const ringGeometry = new THREE.TorusGeometry(0.7, 0.05, 8, 16)
        const ringMaterial = new THREE.MeshBasicMaterial({ color: colorMap[agent.department] })
        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
        ring.rotation.x = Math.PI / 2
        ring.position.set(agent.position.x, 0.2, agent.position.z)
        scene.add(ring)
        agentMesh.userData.ring = ring
      }
    })

    let mouseX = 0
    let mouseY = 0
    let targetX = 0
    let targetY = 0

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onClick = (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, cameraRef.current)
      const intersects = raycaster.intersectObjects(Array.from(agentMeshesRef.current.values()))

      if (intersects.length > 0) {
        const clicked = intersects[0].object as THREE.Mesh
        if (clicked.userData.agent) {
          onAgentClick(clicked.userData.agent)
        }
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    containerRef.current.addEventListener('click', onClick)

    const animate = () => {
      requestAnimationFrame(animate)

      targetX = mouseX * 10
      targetY = mouseY * 10

      if (cameraRef.current) {
        cameraRef.current.position.x += (targetX - cameraRef.current.position.x) * 0.02
        cameraRef.current.position.y = 50 + targetY * 2
        cameraRef.current.lookAt(0, 0, 0)
      }

      agentMeshesRef.current.forEach((mesh, id) => {
        const agent = agents.find(a => a.id === id)
        if (agent?.status === 'working' && mesh.userData.ring) {
          mesh.userData.ring.rotation.z += 0.02
        }
        
        mesh.rotation.y += 0.01
        
        if (selectedAgent && selectedAgent.id === id) {
          mesh.position.y = 1 + Math.sin(Date.now() * 0.003) * 0.2
        } else if (agent) {
          mesh.position.y = 1
        }
      })

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }

    animate()

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
      
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', handleResize)
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', onClick)
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [departments, agents, onAgentClick, selectedAgent])

  return <div ref={containerRef} className="w-full h-full" />
}
