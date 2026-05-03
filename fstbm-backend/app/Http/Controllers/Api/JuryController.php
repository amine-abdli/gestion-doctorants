<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Jury;
use App\Models\Doctorant;

class JuryController extends Controller
{
    public function index()
    {
        return response()->json(
            Jury::with(['doctorants' => function($q) {
                $q->select('doctorants.id', 'nomfr', 'nomarb', 'nmb_inscription', 'cin')
                  ->withPivot('role', 'grade', 'rolearb', 'graderb', 'nom_modifier', 'local');
            }])->get()
        );
    }
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom'        => 'required|string|max:255',
                'nomarb'     => 'nullable|string|max:255',
                'specialite' => 'nullable|string|max:255',
                'local'      => 'nullable|string|max:255',
                'F'          => 'nullable|boolean',
            ]);

            $jury = Jury::create($validated);
            return response()->json($jury, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation échouée', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $jury = Jury::with(['doctorants' => function($q) {
            $q->select('doctorants.id', 'nomfr', 'nomarb', 'nmb_inscription', 'cin')
              ->withPivot('role', 'grade', 'rolearb', 'graderb', 'nom_modifier', 'local');
        }])->findOrFail($id);
        return response()->json($jury);
    }

    public function update(Request $request, $id)
    {
        try {
            $jury = Jury::findOrFail($id);
            $validated = $request->validate([
                'nom'        => 'sometimes|required|string|max:255',
                'nomarb'     => 'nullable|string|max:255',
                'specialite' => 'nullable|string|max:255',
                'local'      => 'nullable|string|max:255',
                'F'          => 'nullable|boolean',
            ]);
            $jury->update($validated);
            return response()->json($jury);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation échouée', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $jury = Jury::findOrFail($id);
        $jury->delete();
        return response()->json(null, 204);
    }

    // POST /api/juries/{id}
    public function attachDoctorant(Request $request, $id)
    {
        try {
            $jury = Jury::findOrFail($id);

            $validated = $request->validate([
                'doctorant_id' => 'required|exists:doctorants,id',
                'role'         => 'nullable|string|max:100',
                'rolearb'      => 'nullable|string|max:100',
                'nom_modifier' => 'nullable|string|max:255',
                'grade'        => 'nullable|string|max:100',
                'graderb'      => 'nullable|string|max:100',
                'local'        => 'nullable|string|max:255',
            ]);

            // Attacher (permet plusieurs entrées avec rôles différents)
            $jury->doctorants()->attach($validated['doctorant_id'], [
                'role'  => $validated['role']  ?? '',
                'rolearb' => $validated['rolearb'] ?? '',
                'grade' => $validated['grade'] ?? '',
                'graderb' => $validated['graderb'] ?? '',
                'nom_modifier' => $validated['nom_modifier'] ?? '',
                'local' => $validated['local'] ?? $jury->local ?? '',
            ]);

            // Retourner le jury mis à jour avec ses doctorants
            $jury->load(['doctorants' => function($q) {
                $q->select('doctorants.id', 'nomfr', 'nomarb', 'nmb_inscription', 'cin')
                  ->withPivot('role', 'grade', 'rolearb', 'graderb', 'nom_modifier', 'local');
            }]);

            return response()->json($jury, 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Validation échouée', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}