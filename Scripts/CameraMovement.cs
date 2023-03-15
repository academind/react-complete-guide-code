using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraMovement : MonoBehaviour {
    
	public float distance;
    public float height;
	public float smoothness;
	public float rotationForce;
	public float zoomHeightMultiplier;
	
	public Transform camTarget;
	
	Vector3 velocity;
 
    void LateUpdate(){
		//Check if the camera has a target to follow
        if(!camTarget)
            return;
		
		Vector3 angle = transform.localEulerAngles;
		
		if(angle.x < 37){
			angle.x += Time.deltaTime * 40;
			transform.localEulerAngles = angle;
		}
		
		Vector3 pos = Vector3.zero;
		pos.x = camTarget.position.x;
		pos.y = camTarget.position.y + height;
		//pos.y = transform.position.y;
		pos.z = camTarget.position.z - distance;
		
		transform.position = Vector3.SmoothDamp(transform.position, pos, ref velocity, smoothness);
		
		Vector3 rotation = transform.eulerAngles;
		rotation.y = -180 + (camTarget.position.x * rotationForce);
		transform.eulerAngles = rotation;
		
		//Quaternion targetRot = Quaternion.Euler(new Vector3(45, 0, 0));
		//transform.rotation = Quaternion.Lerp(transform.rotation, targetRot, Time.deltaTime);
    }
	
	//screen shake (for example when we hit the ball)
	public IEnumerator Shake(float duration, float amount){
		
		float elapsed = 0f;
		
		while(elapsed < duration){
			float x = Random.Range(-1f, 1f) * amount;
			float y = Random.Range(-1f, 1f) * amount;
			float z = Random.Range(-1f, 1f) * amount;
			
			transform.position += new Vector3(x, y, z);
			
			elapsed += Time.deltaTime;
			
			yield return 0;
		}
	}
	
	//zoom in on player based on camera height
	public void Zoom(bool zoomIn){
		if(zoomIn){
			height *= zoomHeightMultiplier;
		}
		else{
			height *= (1f/zoomHeightMultiplier);
		}
	}
	
	//switch to new target for a brief moment (to show the score board)
	public void SwitchTargetTemp(Transform newTarget, float duration, float smooth){
		StartCoroutine(Switch(newTarget, duration, smooth));
	}
	
	//switches to new target, then waits and switches back
	IEnumerator Switch(Transform newTarget, float duration, float smooth){
		Transform original = camTarget;
		float originalSmoothness = this.smoothness;
		
		camTarget = newTarget;
		smoothness = smooth;
		
		yield return new WaitForSeconds(duration);
		
		camTarget = original;
		
		yield return new WaitForSeconds(1f);
		
		smoothness = originalSmoothness;
	}
}
