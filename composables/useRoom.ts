export const useRoom = () => {
  const roomId = useState('room', () => null)
  const isRoomOwner = useState('isRoomOwner', () => false)
  function updateRoomId (newId: number) {
    roomId.value = newId
  }
  function toggleRoomOwner () {
    isRoomOwner.value = !isRoomOwner.value
  }
  return { roomId, updateRoomId, isRoomOwner, toggleRoomOwner }
}